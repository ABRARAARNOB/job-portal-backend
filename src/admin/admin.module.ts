import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Job } from 'src/job/entities/job.entity';
import { Application } from 'src/application/entities/application.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Job, Application])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
