import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobNotFoundException } from 'src/common/exceptions/job-not-found.exception';
import { MailService } from 'src/mail/mail.service';
import { UnauthorizedRecruiterException } from 'src/common/exceptions/unauthorized-recruiter.exception';

@Injectable()
export class JobService 
{
    constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async create( recruiterId: number, createJobDto: CreateJobDto) {
    const recruiter = await this.userRepository.findOne({
      where: { id: recruiterId },
    });

    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    const job = this.jobRepository.create({
      ...createJobDto,
      recruiter,
    });

    return this.jobRepository.save(job);
  }
  
  async findAll() {
    return this.jobRepository.find({
      relations: {recruiter: true},
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const jobs = await this.jobRepository.findOne({
      where: { id },
      relations: {recruiter: true},
    });

    if (!jobs) {
      throw new JobNotFoundException();
    }

    return jobs;
  }

  async findMyJobs(recruiterId: number) {


    const job =  this.jobRepository.find({
      where: {
        recruiter: {
          id: recruiterId,
        },
      },
      relations: {recruiter: true},
      order: {
        createdAt: 'DESC',
      },
    });

    if (!job) {
      throw new JobNotFoundException();
    }

    return job;


  }

  async update(
    id: number,
    recruiterId: number,
    dto: UpdateJobDto,
  ) {
    const job = await this.findOne(id);

    if (job.recruiter.id !== recruiterId) {
      throw new UnauthorizedRecruiterException();
    }

    Object.assign(job, dto);

    return this.jobRepository.save(job);
  }

  async remove(id: number, recruiterId: number) {
    const job = await this.findOne(id);

    if (job.recruiter.id !== recruiterId) {
      throw new UnauthorizedRecruiterException();
    }

    await this.jobRepository.remove(job);

    return {
      message: 'Job deleted successfully',
    };
  }
}
