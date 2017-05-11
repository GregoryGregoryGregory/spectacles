FROM node:latest

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY . /usr/src/api
RUN npm install

CMD ['npm', 'start']
