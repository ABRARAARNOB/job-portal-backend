
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Role } from 'src/common/enums/role.enum';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AdminService 
{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,

        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
    ) {}


    async dashboard() {
        const totalUsers = await this.userRepository.count();

        const totalStudents = await this.userRepository.count({
            where: {
            role: Role.STUDENT,
            },
        });

        const totalRecruiters = await this.userRepository.count({
            where: {
            role: Role.RECRUITER,
            },
        });

        const totalJobs = await this.jobRepository.count();

        const totalApplications = await this.applicationRepository.count();

        return {
            totalUsers,
            totalStudents,
            totalRecruiters,
            totalJobs,
            totalApplications,
        };
    }



    async findAllUsers() {
        return this.userRepository.find();
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.remove(user);

        return {
            message: 'User deleted successfully',
        };
    }



    async findAllJobs() {
        return this.jobRepository.find({
            relations: {
            recruiter: true,
            },
            order: {
            createdAt: 'DESC',
            },
        });
    }

    async deleteJob(id: number) {
        const job = await this.jobRepository.findOne({
            where: { id },
        });

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        await this.jobRepository.remove(job);

        return {
            message: 'Job deleted successfully',
        };
    }


    async findAllApplications() {
        return this.applicationRepository.find({
            relations: {
            student: true,
            job: true,
            },
            order: {
            appliedAt: 'DESC',
            },
        });
    }

    
}
