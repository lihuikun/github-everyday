CREATE TABLE IF NOT EXISTS daily_github (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    lang VARCHAR(50) NOT NULL COMMENT '编程语言',
    list_data JSON COMMENT '项目列表数据',
    html_content TEXT COMMENT 'HTML内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `idx_date_lang` (date, lang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='GitHub每日项目数据'; 