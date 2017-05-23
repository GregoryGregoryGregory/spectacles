const express = require('express');
const cors = require('cors');
const socket = require('./socket');
const redis = require('./util/redis');

module.exports = (server, options = {}) => {
  socket(server);
  const r = redis(options);
  const router = express.Router();

  router.use(cors());

  router.get('/info', (req, res, next) => {
    Promise.all([
      r.scardAsync('users'),
      r.scardAsync('guilds'),
      r.scardAsync('channels'),
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
        presences: presences ? Object.keys(presences).map((v, i) => presences[i]) : [],
        website: '',
        prefixes: [],
        oauth: '',
        guild: '',
      });
    }).catch(e => next(e));
  });

  router.get('/', (req, res) => {
    res.json({
      message: 'Please specify endpoint.',
    });
  });

  return router;
};
