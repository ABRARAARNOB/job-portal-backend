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
      throw new NotFoundException('Student not found');
    }

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.applicationRepository.findOne({
      where: {
        student: { id: studentId },
        job: { id: jobId },
      },
      relations: {student: true, job: true},
    });

    if (existing) {
      throw new BadRequestException(
        'You have already applied for this job',
      );
    }

    const application = this.applicationRepository.create({
      student,
      job,
      status: ApplicationStatus.PENDING,
    });

    return this.applicationRepository.save(application);
  }

  async myApplications(studentId: number) {
    return this.applicationRepository.find({
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
  }

  async getApplicants(jobId: number, recruiterId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: {recruiter: true},
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.recruiter.id !== recruiterId) {
      throw new ForbiddenException();
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
      throw new NotFoundException();
    }

    if (application.job.recruiter.id !== recruiterId) {
      throw new ForbiddenException();
    }

    application.status = dto.status;

    return this.applicationRepository.save(application);
  }
}
