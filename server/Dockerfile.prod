FROM node:12.17.0-alpine as builder

WORKDIR /app
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
RUN npm install -g ts-node typescript
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn run build

FROM node:12.17.0-alpine

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
RUN yarn install --production=true
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["yarn", "run", "start:dist"]
