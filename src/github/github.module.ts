import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { EmailModule } from 'src/email/email.module';
import { CozeModule } from 'src/coze/coze.module';

@Module({
  imports: [EmailModule,CozeModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
