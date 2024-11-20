import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { CozeModule } from './coze/coze.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [ScheduleModule.forRoot(),ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // 指定.env文件路径
  }), GithubModule, EmailModule, CozeModule, CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
