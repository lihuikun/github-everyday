import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GithubService } from '../github/github.service';

@Injectable()
export class CronService {
  constructor(private readonly githubService: GithubService) { }

  // 使用 @Cron 装饰器来定义一个定时执行的方法
  @Cron('00 02 * * *')
  handleCronJob() {
    this.githubService.findOne('JavaScript');
  }
}