import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService 
{
    private readonly logger = new Logger(MailService.name);
    constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(
    to: string,
    subject: string,
    text: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }
}
