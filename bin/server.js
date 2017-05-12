const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const api = require('../src/index');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(api(server), { host: 'redis' });

server.listen(8080, () => console.log('listening on port 8080')); // eslint-disable-line no-console
