#!/bin/bash

# 请注意
# 本脚本的作用是把本项目编译的结果保存到deploy文件夹中
# 1. 把项目数据库文件拷贝到deploy/db
# 2. 编译golfworld-admin
# 3. 编译golfworld-all模块，然后拷贝到deploy/golfworld

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/../..
golfworld_HOME=$PWD
echo "golfworld_HOME $golfworld_HOME"

# 复制数据库
cat $golfworld_HOME/golfworld-db/sql/golfworld_schema.sql > $golfworld_HOME/deploy/db/golfworld.sql
cat $golfworld_HOME/golfworld-db/sql/golfworld_table.sql >> $golfworld_HOME/deploy/db/golfworld.sql
cat $golfworld_HOME/golfworld-db/sql/golfworld_data.sql >> $golfworld_HOME/deploy/db/golfworld.sql

cd $golfworld_HOME/golfworld-admin
# 安装阿里node镜像工具
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 安装node项目依赖环境
cnpm install
cnpm run build:dep

cd $golfworld_HOME
mvn -U clean package
cp -f $golfworld_HOME/golfworld-all/target/golfworld-all-*-exec.jar $golfworld_HOME/deploy/golfworld/golfworld.jar