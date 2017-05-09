const express = require('express');
const socket = require('./socket');
const redis = require('./redis');

module.exports = (server, options) => {
  socket(server);
  const r = redis(options);
  const router = express.Router();

  router.get('/info', (req, res) => {
    Promise.all([
      r.scardAsync('user'),
      r.scardAsync('guild'),
      r.scardAsync('channel'),
      r.getAsync('me'),
    ])
    .then(([user, guild, channel, me]) => {
      res.json({
        guildCount: guild,
        userCount: user,
        channelCount: channel,
        description: '',
        me,
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
