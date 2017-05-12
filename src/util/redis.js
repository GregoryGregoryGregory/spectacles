const redis = require('redis');
const tsubaki = require('tsubaki');

tsubaki.promisifyAll(redis.RedisClient.prototype);
tsubaki.promisifyAll(redis.Multi.prototype);

module.exports = options => redis.createClient(Object.assign(options, {
  retry_strategy: ({ total_retry_time: time, attempt }) => {
    if (time > 1000 * 60 * 60) throw new Error('Retry time exhausted.');
    if (attempt > 10) throw new Error('Too many retry attempts.');
    return Math.min(options.attempt * 100, 3000);
  },
}));
