import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail({to, subject, text,html}) {
    console.log('process.env.NEST_EMAIL', process.env.NEST_EMAIL)
    // Implement your email sending logic here
    return await this.mailerService.sendMail({
      to,
      subject,
      text,
      html
    })
  }
}
