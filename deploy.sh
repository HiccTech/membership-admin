#!/bin/bash
set -e

PROJECT_NAME="my-nextjs-app"
LOCAL_PROJECT_DIR=$(pwd)
SERVER_USER="root"
SERVER_IP="47.84.91.117"
SERVER_PATH="/home/user/deploy"
 
# 1. 同步项目
echo "同步项目到服务器..."
rsync -av --exclude 'node_modules' --exclude '.next/cache' --exclude '.git' $LOCAL_PROJECT_DIR/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# 2. 服务器端构建并运行 Docker
# echo "在服务器上构建 Docker 镜像并运行..."
# ssh $SERVER_USER@$SERVER_IP << EOF
# cd $SERVER_PATH
# docker build -t $PROJECT_NAME:latest .
# docker stop $PROJECT_NAME || true
# docker rm $PROJECT_NAME || true
# docker run -d --name $PROJECT_NAME -p 3000:3000 $PROJECT_NAME:latest
# EOF

# echo "部署完成，访问 http://$SERVER_IP:3000"
