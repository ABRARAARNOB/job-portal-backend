import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([Application,Job,User]),MailModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
