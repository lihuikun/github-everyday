import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // 指定.env文件路径
  }), GithubModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
