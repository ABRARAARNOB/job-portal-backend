import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { ApplicationStatus } from 'src/common/enums/application-status.emun';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { MailService } from 'src/mail/mail.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { JobNotFoundException } from 'src/common/exceptions/job-not-found.exception';
import { AlreadyAppliedException } from 'src/common/exceptions/already-applied.exception';
import { ApplicationNotFoundException } from 'src/common/exceptions/application-not-found.exception';
import { UnauthorizedRecruiterException } from 'src/common/exceptions/unauthorized-recruiter.exception';

@Injectable()
export class ApplicationService
{
    constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService
  ) {}


  async apply(jobId: number, studentId: number) {

    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });

    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: {recruiter: true},
    });

    if (!student) {
      throw new UserNotFoundException();
    }

    if (!job) {
      throw new JobNotFoundException();
    }

    const existing = await this.applicationRepository.findOne({
      where: {
        student: { id: studentId },
        job: { id: jobId },
      },
      relations: {student: true, job: true},
    });

    if (existing) {
      throw new AlreadyAppliedException();
    }

    const application = this.applicationRepository.create({
      student,
      job,
      status: ApplicationStatus.PENDING,
    });

    await this.mailService.sendMail(
    student.email,
    'Application Submitted',
    `Hello ${student.fullName},
    You have successfully applied for:
    ${job.title}
    Good luck!`
    );

    return this.applicationRepository.save(application);
  }


  async myApplications(studentId: number) {
    const application = this.applicationRepository.find({
      where: {
        student: {
          id: studentId,
        },
      },
      relations: {job: true},
      order: {
        appliedAt: 'DESC',
      },
    });

    if(!application)
    {
      throw new ApplicationNotFoundException();
    }

    return application;
  }

  async searchAppliedJobs(studentId: number, title?: string) {
    const query = this.applicationRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      .where('application.student.id = :studentId', { studentId });

    if (title) {
      query.andWhere('job.title ILIKE :title', { title: `%${title}%` });
    }

    query.orderBy('application.appliedAt', 'DESC');
    
    const applications = await query.getMany();
    if (!applications || applications.length === 0) {
      throw new ApplicationNotFoundException();
    }
    return applications;
  }

  async filterAppliedJobsBySalary(studentId: number, minSalary?: number, maxSalary?: number) {
    const query = this.applicationRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      .where('application.student.id = :studentId', { studentId });

    if (minSalary !== undefined && !isNaN(minSalary)) {
      query.andWhere('job.salary >= :minSalary', { minSalary });
    }

    if (maxSalary !== undefined && !isNaN(maxSalary)) {
      query.andWhere('job.salary <= :maxSalary', { maxSalary });
    }

    query.orderBy('application.appliedAt', 'DESC');
    
    const applications = await query.getMany();
    if (!applications || applications.length === 0) {
      throw new ApplicationNotFoundException();
    }
    return applications;
  }

  async getApplicants(jobId: number, recruiterId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: {recruiter: true},
    });

    if (!job) {
      throw new JobNotFoundException();
    }

    if (job.recruiter.id !== recruiterId) {
      throw new UnauthorizedRecruiterException();
    }

    return this.applicationRepository.find({
      where: {
        job: {
          id: jobId,
        },
      },
      relations: {student: true},
    });
  }

  async updateStatus(
    applicationId: number,
    recruiterId: number,
    dto: UpdateStatusDto,
  ) {
    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationId,
      },
      relations:{
                  job: {
                    recruiter: true,
                    },
                }
    });

    if (!application) {
      throw new ApplicationNotFoundException();
    }

    if (application.job.recruiter.id !== recruiterId) {
      throw new UnauthorizedRecruiterException();
    }

    application.status = dto.status;

    await this.mailService.sendMail(
    application.student.email,
    'Application Status Updated',
    `Hello ${application.student.fullName},
    Your application status has been updated.
    Job:
    ${application.job.title}
    Status:
    ${application.status}
    `,
    );

    return this.applicationRepository.save(application);
  }
}
