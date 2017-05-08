const express = require('express');
const socket = require('./socket');
const Redis = require('./Redis');

module.exports = (server, options) => {
  socket(server);
  const r = new Redis(options);
  const router = express.Router();

  router.get('/info', (req, res) => {
    Promise.all([
      r.getInfo(),
      r.getUser('me'),
    ])
    .then(([info, user]) => {
      res.json({
        guildCount: info.guilds.size,
        userCount: info.users.size,
        channelCount: info.channels.size,
        description: '',
        user,
        presences: [],
        website: '',
        prefixes: [],
        oauth: '',
        guild: '',
      });
    });
  });

  return router;
};
