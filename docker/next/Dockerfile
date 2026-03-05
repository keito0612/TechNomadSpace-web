FROM node:23-alpine

WORKDIR /app

# nextアプリが用意できた後、戻す
# package.jsonとpackage-lock.jsonをコピー
COPY ./frontend/next/package*.json ./

RUN npm install


# 開発サーバーの起動
CMD ["npm", "run", "dev"]
