-- 删除数据库并重新创建
DROP DATABASE IF EXISTS ORDER_SYSTEM_DB;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS ORDER_SYSTEM_DB;
USE ORDER_SYSTEM_DB;

-- 1. 删除已存在的表（如果存在）
DROP TABLE IF EXISTS DC_USER;

-- 2. 创建表
CREATE TABLE DC_USER (
                         USER_ID INT NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
                         USERNAME VARCHAR(50) NOT NULL COMMENT '用户名',
                         PASSWORD VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
                         CREATE_TIME DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                         IS_DISABLED TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否禁用：0-正常，1-禁用',
                         LAST_LOGIN_TIME DATETIME NULL COMMENT '最后登录时间',
                         LOGIN_COUNT INT NOT NULL DEFAULT 0 COMMENT '登录次数',

                         PRIMARY KEY (USER_ID),
                         UNIQUE KEY IDX_USERNAME (USERNAME),
                         KEY IDX_CREATE_TIME (CREATE_TIME),
                         KEY IDX_IS_DISABLED (IS_DISABLED),
                         KEY IDX_USERNAME_PASSWORD (USERNAME, PASSWORD)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 3. 插入初始数据（密码使用加密存储）
-- 注意：实际应用中应该使用更强的哈希算法，这里仅作示例
INSERT INTO DC_USER (USERNAME, PASSWORD, CREATE_TIME, IS_DISABLED)
VALUES
    ('admin', 'admin123', NOW(), 0),
    ('test', 'test123', NOW(), 0),
    ('guest', 'guest123', NOW(), 1);  -- 禁用账户示例
