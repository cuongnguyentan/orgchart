FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./vendor ./vendor

RUN npm install
COPY . .

RUN npm run build
