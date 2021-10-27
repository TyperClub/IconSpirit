FROM node:14-alpine AS dependencies

COPY . /app

WORKDIR /app

RUN ls

RUN npm install --registry=https://registry.npm.taobao.org   # 安装依赖

EXPOSE 3000

CMD [ "npm", "start"]