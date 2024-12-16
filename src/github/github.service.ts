import { CozeService } from './../coze/coze.service';
import { EmailService } from './../email/email.service';
import { Injectable } from '@nestjs/common';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import axios from 'axios';
import { marked } from 'marked';
@Injectable()
export class GithubService {
  constructor(private readonly emailService: EmailService, private readonly cozeService: CozeService) {
    // 配置marked选项
    marked.setOptions({
      breaks: true, // 支持GitHub风格的换行
      gfm: true,    // 启用GitHub风格的Markdown
    });
  }
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
      url: `https://api.ossinsight.io/v1/trends/repos?period=past_24_hours&language=${lang}`,
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
    }).slice(0, 2);
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
    // 调用邮件服务发送邮件
    await this.emailService.sendEmail({
      to: 'lihk180542@gmail.com',
      subject: 'Github项目每日推荐',
      text: JSON.stringify(list),
      html: htmlContent
    }
    );
    console.log('发送邮件啦~', list)
    this.getCozeRes(list)
    return list;
    // return cozeRes;
  }
  async getCozeRes(list: any[]) {
    try {
      const cozeResults = [];
      
      // 遍历list获取每个项目的coze结果
      for (const item of list) {
        const {
          name, url, lang, stars, docUrl, forks, license
        } = item;
        
        try {
          const cozeRes = await this.cozeService.coze(url);
          cozeResults.push({
            name,
            url,
            cozeAnalysis: cozeRes
          });
        } catch (error) {
          console.error(`处理 ${name} 的coze失败:`, error);
          continue;
        }
      }

      // 构建邮件内容
      const htmlContent = this.generateCozeEmailContent(cozeResults);
      
      // 发送邮件
      await this.emailService.sendEmail({
        to: 'lihk180542@gmail.com', // 确保在.env中设置了接收邮箱
        subject: 'GitHub 项目 Coze 分析报告',
        text: 'GitHub 项目 Coze 分析报告',
        html: htmlContent
      });

      return cozeResults;
    } catch (error) {
      console.error('Coze处理过程出错:', error);
      throw error;
    }
  }

  private generateCozeEmailContent(cozeResults: any[]): string {
    let html = `
      <h2>GitHub 项目 Coze 分析报告</h2>
      <style>
        .markdown-body {
          font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
          font-size: 16px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .markdown-body pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 16px;
          overflow: auto;
        }
        .markdown-body code {
          background-color: rgba(175,184,193,0.2);
          padding: 0.2em 0.4em;
          border-radius: 6px;
          font-size: 85%;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        .markdown-body ul, .markdown-body ol {
          padding-left: 2em;
        }
        .markdown-body blockquote {
          padding: 0 1em;
          color: #656d76;
          border-left: 0.25em solid #d0d7de;
          margin: 0;
        }
      </style>
      <div style="margin: 20px 0;">
    `;

    cozeResults.forEach(result => {
      html += `
        <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3>
            <a href="${result.url}" style="color: #0366d6; text-decoration: none;">
              ${result.name}
            </a>
          </h3>
          <div class="markdown-body" style="white-space: pre-wrap; padding: 10px; border-radius: 3px;">
            ${marked(result.cozeAnalysis)}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
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
