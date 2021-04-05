FROM node:12.17.0-alpine

WORKDIR /app

RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
RUN npm install -g ts-node typescript

COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install

EXPOSE 9000
EXPOSE 8080
CMD ["yarn", "start"]
