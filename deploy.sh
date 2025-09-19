#!/bin/bash
set -e

# ---------- 配置 ----------
PROJECT_NAME="my-nextjs-app"
LOCAL_PROJECT_DIR=$(pwd)
SERVER_USER="root"
SERVER_IP="47.84.91.117"
SERVER_PATH="/srv/membershipAdmin"
SSH_KEY="~/.ssh/HICCPET-club-key.pem "  

# ---------- 输入环境 ----------
ENV=$1   # test 或 prod
if [[ "$ENV" != "test" && "$ENV" != "prod" ]]; then
  echo "❌ 用法: $0 [test|prod]"
  exit 1
fi

COMPOSE_FILE="compose.$ENV.yml"

# ---------- 1. 同步项目 ----------
echo "🚀 同步项目到服务器..."
rsync -av -e "ssh -i $SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    $LOCAL_PROJECT_DIR/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# ---------- 2. 服务器端构建并运行 ----------
echo "🔧 在服务器上构建并运行 Docker (环境: $ENV)..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP << EOF
cd $SERVER_PATH
docker compose -f $COMPOSE_FILE build
docker compose -f $COMPOSE_FILE down
docker compose -f $COMPOSE_FILE up -d
EOF

# ---------- 3. 输出访问地址 ----------
if [[ "$ENV" == "test" ]]; then
  PORT=3001
  NETWORK=https://admin-test-club-sg.hiccpet.com
else
  PORT=3000
  NETWORK=https://admin-club-sg.hiccpet.com
fi

echo "部署完成，访问 http://$SERVER_IP:$PORT OR $NETWORK"
