const http = require('http');
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const api = require('../src/index');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(api(server));

describe('GET /info', function() {
  it('responds with expected data', function(done) {
    request(app)
      .get('/info')
      .expect(200)
      .expect((res) => {
        assert.equal(typeof res.body.guildCount, 'number');
        assert.equal(typeof res.body.userCount, 'number');
        assert.equal(typeof res.body.channelCount, 'number');
        assert.equal(typeof res.body.description, 'string');
        assert.equal(typeof res.body.user, 'object');
        assert(Array.isArray(res.body.presences));
        assert.equal(typeof res.body.website, 'string');
        assert(Array.isArray(res.body.prefixes));
        assert.equal(typeof res.body.oauth, 'string');
      })
      .end(err => done(err));
  });
});
