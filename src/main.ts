import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "dotenv";
const path = require('path');
config({ path: path.join(__dirname, '../.env') });
console.log(process.env.NEST_EMAIL);//读取

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
