import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeModule } from './resume/resume.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
              isGlobal: true,
            }),
            UserModule, JobModule, ApplicationModule,
            TypeOrmModule.forRoot({
              type: 'postgres',
              host: 'dpg-dafcuadbedkc738nrdj0-a',
              port: 5432,
              username: 'job_portal_c664_user',
              password: 'D6uPBYynaGuPHqemer2yfeK4tpCiXrFI', 
              database: 'job_portal_c664',
              autoLoadEntities: true,
              synchronize: true,

            }),
            ResumeModule,
            AuthModule,
            AdminModule,
            MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
