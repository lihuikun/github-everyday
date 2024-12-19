# GitHub 每日推荐项目

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 项目描述

这是一个基于 [NestJS](https://nestjs.com/) 框架的项目，旨在每天从 GitHub 获取开源项目的推荐，并通过邮件发送给用户。项目使用 TypeScript 编写，支持 MySQL 数据库存储。

## 项目设置

### 环境要求

- Node.js >= 20.x
- MySQL 数据库

### 安装依赖

在项目根目录下运行以下命令以安装依赖：
 pnpm install

### 配置环境变量

在项目根目录下创建一个 `.env` 文件，并根据以下模板配置数据库和邮件服务信息：
```
NODE_ENV=development
NEST_EMAIL=你的邮箱
NEST_EMAIL_PASSWORD=你的邮箱密码
COZE_API_KEY=你的Coze API密钥
COZE_BOT_ID=你的Coze Bot ID
PORT=47296
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=github_everyday
```

### 数据库初始化

在 MySQL 中执行以下 SQL 语句以创建数据库和数据表：
```
# 创建数据库
CREATE DATABASE IF NOT EXISTS github_everyday;
USE github_everyday;

# 创建数据库表
CREATE TABLE IF NOT EXISTS daily_github (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    list_data JSON COMMENT '项目列表数据',
    html_content TEXT COMMENT 'HTML内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `idx_date` (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='GitHub每日项目数据'; 
```


## 编译和运行项目

使用以下命令启动项目：

```
# 开发模式
$ pnpm run start

# 观察模式
$ pnpm run start:dev

# 生产模式
$ pnpm run start:prod
```

## 部署nest项目

使用以下打包启动项目：
```
# 打包
$ pnpm build

# pm2启动
$ pm2 start --name github-everyday

# pm2 查看启动状态
$ pm2 list

# pm2 查看log
$ pm2 logs github-everyday 
```