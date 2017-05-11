const express = require('express');
const socket = require('./socket');
const redis = require('./util/redis');

module.exports = (server, options = {}) => {
  socket(server);
  const r = redis(options);
  const router = express.Router();

  router.get('/info', (req, res) => {
    Promise.all([
      r.scardAsync('user'),
      r.scardAsync('guild'),
      r.scardAsync('channel'),
      r.hgetallAsync('me'),
      r.hgetallAsync('presences'),
    ])
    .then(([user, guild, channel, me, presences]) => {
      res.json({
        guildCount: guild,
        userCount: user,
        channelCount: channel,
        description: '',
        user: me,
        presences: Object.keys(presences).map((v, i) => presences[i]),
        website: '',
        prefixes: [],
        oauth: '',
        guild: '',
      });
    });
  });

  return router;
};
