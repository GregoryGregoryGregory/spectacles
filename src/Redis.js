const redis = require('redis');
const tsubaki = require('tsubaki');

tsubaki.promisifyAll(redis.RedisClient.prototype);
tsubaki.promisifyAll(redis.Multi.prototype);

class Redis {
  constructor(options) {
    this.client = redis.createClient(options);
  }

  getUser(id) {
    return this.client.hgetallAsync(`user:${id}`);
  }

  getInfo() {
    return Promise.all([
      this.getUsers(),
      this.getChannels(),
      this.getGuilds(),
    ]).then(([users, channels, guilds]) => { // eslint-disable-line arrow-body-style
      return { users, channels, guilds };
    });
  }

  getUsers() {
    return this._scan('match', 'user:*');
  }

  getChannels() {
    return this._scan('match', 'channel:*');
  }

  getGuilds() {
    return this._scan('match', 'guild:*');
  }

  _scan(...args) {
    const out = new Map();
    const multi = this.client.multi();
    this.__scan(0, new Set(), ...args)
      .then(data => Promise.all(Array.from(data.values()).map(k => multi.hgetallAsync(k))))
      .then(() => multi.execAsync())
      .then(results => results.forEach(r => out.set(r.id, r)))
      .then(() => out);
  }

  __scan(cursor, keys, ...args) {
    return this.client.scanAsync(cursor, ...args).then(([pointer, data]) => {
      data.forEach(k => keys.add(k));
      if (pointer === 0) return keys;
      return this.__scan(pointer, keys);
    });
  }
}

module.exports = Redis;
