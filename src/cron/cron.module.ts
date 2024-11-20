import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [GithubModule],
  providers: [CronService],
})
export class CronModule {}