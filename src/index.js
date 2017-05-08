const express = require('express');
const socket = require('./socket');
const Redis = require('./Redis');

module.exports = (server, options) => {
  socket(server);
  const r = new Redis(options);
  const router = express.Router();

  router.get('/info', (req, res) => {
    r.getInfo().then(data => res.json(data));
  });

  return router;
};
