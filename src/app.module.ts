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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
              ServeStaticModule.forRoot({
              rootPath: join(process.cwd(), 'uploads'),
              serveRoot: '/uploads',
            }),
            ConfigModule.forRoot({
              isGlobal: true,
            }),
            UserModule, JobModule, ApplicationModule,
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');

                return {
                  type: 'postgres' as const,
                  ...(databaseUrl
                    ? { url: databaseUrl }
                    : {
                        host: configService.get<string>('DB_HOST', 'localhost'),
                        port: Number(configService.get<string>('DB_PORT', '5432')),
                        username: configService.get<string>('DB_USERNAME', 'postgres'),
                        password: configService.get<string>('DB_PASSWORD', ''),
                        database: configService.get<string>('DB_NAME', 'job_portal'),
                      }),
                  autoLoadEntities: true,
                  synchronize:
                    configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
                  ssl:
                    configService.get<string>('DB_SSL') === 'true'
                      ? { rejectUnauthorized: false }
                      : undefined,
                };
              },
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
