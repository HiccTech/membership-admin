# ---------- Build stage ----------
FROM node:lts-slim AS builder

WORKDIR /app

# 先复制依赖文件，避免缓存失效
COPY package.json package-lock.json* ./
RUN npm ci

# 再复制项目代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# ---------- Production stage ----------
FROM node:lts-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Next.js 推荐配置
ENV NEXT_TELEMETRY_DISABLED=1

# 只复制必要文件
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 端口
EXPOSE 3000

# 用非 root 用户运行
USER node

CMD ["npm", "start"]
