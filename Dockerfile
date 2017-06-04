FROM node:alpine

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api
COPY package.json ./

RUN apk add --no-cache curl git build-base g++ \
    && npm install

COPY . .

EXPOSE 8080

CMD ["node", "bin/server.js"]
