import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';

@Injectable()
export class CozeService {
  async coze(query: string) {
    const config = {
      url: 'https://api.coze.com/open_api/v2/chat',
      token: process.env.COZE_API_KEY!,
      body: {
        bot_id: process.env.COZE_BOT_ID,
        user: 'user',
        query,
        stream: false,
      },
    }
    const res = await axios(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      data: JSON.stringify(config.body),
    })
    console.log("🚀 ~ CozeService ~ coze ~ config:", res.data['messages'][2]['content'])
    return res.data['messages'][2]['content']
  }
}
