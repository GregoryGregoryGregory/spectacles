const express = require('express');
const ws = require('ws');

module.exports = (server) => {
  const router = express.Router();
  const wss = new ws.Server({ server });

  wss.on('connection', () => {
    //
  });

  return router;
};
