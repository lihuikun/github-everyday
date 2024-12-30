import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { join } from 'path';

// 确保在正确的路径加载 .env 文件
dotenv.config({ path: join(__dirname, '../../.env') });

// 添加一些调试日志
console.log('Database Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  // 不要打印密码
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

export default pool; 