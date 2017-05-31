const redis = require('redis');
const tsubaki = require('tsubaki');

tsubaki.promisifyAll(redis.RedisClient.prototype);
tsubaki.promisifyAll(redis.Multi.prototype);
/**
 * @TODO Make disconnect/reconnect an event not a strategy.
 */
module.exports = (options) => {
  const client = redis.createClient(Object.assign(options, {
    retry_strategy: ({ total_retry_time: time, attempt }) => {
      if (time > 1000 * 60 * 60) return new Error('Retry time exhausted.');
      if (attempt > 10) return undefined;
      return Math.min(options.attempt * 100, 3000);
    },
  }));

  client.scanRecursive = (cursor = 0, match, count, old = []) =>
    client.scanAsync(...[cursor, match, count].filter(e => typeof e !== 'undefined')).then(([newCursor, elements]) => {
      const data = old.concat(elements);
      if (newCursor === 0) return data;
      return client.scanRecursive(newCursor, match, count, data);
    });

  return client;
};
