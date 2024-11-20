import { CozeService } from './../coze/coze.service';
import { EmailService } from './../email/email.service';
import { Injectable } from '@nestjs/common';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import axios from 'axios';
@Injectable()
export class GithubService {
  constructor(private readonly emailService: EmailService) { }
  create(createGithubDto: CreateGithubDto) {
    return 'This action adds a new github';
  }

  findAll() {
    return '返回所有';
  }

  async findOne(lang: string) {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.ossinsight.io/v1/trends/repos?period=past_week&language=${lang}`,
      headers: {
        Accept: "application/json",
      },
    };
    const res = await axios(config);
    const data = await this.getRepoExtraInfoByStar(res.data.data.rows);
    return {
      data
    };
  }

  update(id: number, updateGithubDto: UpdateGithubDto) {
    return `This action updates a #${id} github`;
  }

  remove(id: number) {
    return `This action removes a #${id} github`;
  }
  // 根据star来排序
  async getRepoExtraInfoByStar(list) {
    list.sort((a, b) => b.stars - a.stars);
    list = list.map((item) => {
      return {
        repoName: item.repo_name,
        name: item.repo_name.split("/")[1], // 项目名称
        lang: item.primary_language, //主要语言
        stars: item.stars, //star数量
        docUrl: `https://cdn.jsdelivr.net/gh/${item.repo_name}/README.md`,
        url: `https://github.com/${item.repo_name}`,
      };
    }).slice(0, 5);
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const baseInfo = await this.getRepoExtraInfo(item.repoName);
      list[i] = {
        ...list[i],
        ...baseInfo
      }
    }
    // 使用map函数遍历list数组，并为每个项目生成一个HTML字符串
    const htmlParts = list.map(project => `
    <div style="margin-bottom: 20px;background-color: #f0f0f0;padding: 10px;border-radius: 5px;">
      <p>开源项目：${project.name}</p>
      <p>项目地址：${project.url}</p>
      <p>开发语言：${project.lang}</p>
      <p>项目星星：${project.stars}</p>
      <p>项目文档：${project.docUrl}</p>
      <p>项目forks：${project.forks}</p>
      <p>开源协议：${project.license}</p>
    </div>
    `);

    // 将所有项目的HTML字符串连接成一个单一的字符串
    const htmlContent = htmlParts.join('');
    // const {
    //   name, url, lang, stars, docUrl, forks, license
    // } = list[0]
    // const cozeRes = this.cozeService.coze(url)
    // 调用邮件服务发送邮件
    await this.emailService.sendEmail({
      to: 'lihk180542@gmail.com',
      subject: 'Github项目每日推荐',
      text: JSON.stringify(list),
      html: htmlContent
    }
    );
    console.log('发送邮件啦~', list)
    return list;
    // return cozeRes;
  }

  async getRepoExtraInfo(name) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${name}`);
      return {
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        license: response.data?.license?.name || "暂无",
      };
    } catch (error) {
      return {
        stars: "未知",
        forks: "未知",
        license: "未知",
      };
    }
  }
}