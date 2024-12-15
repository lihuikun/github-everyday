import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { EmailModule } from '../email/email.module';
import { CozeModule } from '../coze/coze.module';

@Module({
  imports: [EmailModule, CozeModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule { }
