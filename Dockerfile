FROM node:latest

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY . .
RUN npm install

EXPOSE 8080

CMD ["node", "bin/server.js"]
