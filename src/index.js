const express = require('express');
const cors = require('cors');
const socket = require('./socket');
const redis = require('./util/redis');

/**
 * Spectacles REST Server
 * @param {ws.Server} server
 * @param {object} options
 */
module.exports = (server, options = {}) => {
  socket(server);
  const r = redis(options);
  const router = express.Router();

  router.use(cors());

  /**
   * @TODO Move routers to own folder. -Nomsy
   * @TODO Add controllers for external handlers. -Nomsy
   * @TODO Add new information written in discord.js-redis (soon) -Nomsy
   */

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

  router.get('/commands', (req, res, next) => {
    r.scanRecursive(0, 'commands:*')
      .then((cmds) => {
        const q = r.multi();
        cmds.forEach(c => q.hgetall(c));
        return q.exec();
      })
      .then((cmds) => {
        const out = {};
        cmds.forEach((c) => {
          out[c.name] = c;
        });
        return res.json(out);
      })
      .catch(next);
  });

  router.get('/', (req, res) => {
    res.json({
      message: 'Please specify endpoint.',
    });
  });

  return router;
};
