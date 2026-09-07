import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
  console.log('MAIL_USER:', configService.get('MAIL_USER'));
  console.log('MAIL_HOST:', configService.get('MAIL_HOST'));

  return {
    transport: {
      host: configService.get('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: configService.get('MAIL_FROM'),
    },
  };
}
    }),
  ],

  providers: [MailService],

  exports: [MailService],
})
export class MailModule {}