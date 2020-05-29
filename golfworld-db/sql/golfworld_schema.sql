drop database if exists golfworld;
drop user if exists 'golfworld'@'%';
-- 支持emoji：需要mysql数据库参数： character_set_server=utf8mb4
create database golfworld default character set utf8mb4 collate utf8mb4_unicode_ci;
use golfworld;
create user 'golfworld'@'%' identified by 'golfworld123456';
grant all privileges on golfworld.* to 'golfworld'@'%';
flush privileges;