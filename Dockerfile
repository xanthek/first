FROM node:16 As development

WORKDIR /var/www/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn start:dev

