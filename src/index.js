const express = require('express');
const socket = require('./socket');
const redis = require('./redis');

module.exports = (server, options) => {
  socket(server);
  const r = redis(options);
  const router = express.Router();

  router.use((req, res, next) => {
    if (!req.app.get('config')) req.app.set('config', options);
    next();
  });

  router.get('/info', (req, res) => {
    Promise.all([
      r.scardAsync('user'),
      r.scardAsync('guild'),
      r.scardAsync('channel'),
      r.hmgetallAsync('me'),
      r.hmgetallAsync('presences'),
    ])
    .then(([user, guild, channel, me, presences]) => {
      res.json({
        guildCount: guild,
        userCount: user,
        channelCount: channel,
        description: '',
        user: me,
        presences,
        website: '',
        prefixes: [],
        oauth: '',
        guild: '',
      });
    });
  });

  return router;
};
