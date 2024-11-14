import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.qq.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('NEST_EMAIL'),
            pass: configService.get<string>('NEST_EMAIL_PASSWORD'),
          }
        },
        defaults: {
          from: `"github 每日推荐" <${configService.get<string>('NEST_EMAIL')}>`
        }
      }),
      inject: [ConfigService], // 注入ConfigService
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}