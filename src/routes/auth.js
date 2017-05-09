const express = require('express');
const simpleOauth2 = require('simple-oauth2');
const jwt = require('jsonwebtoken');

module.exports = (options = {}) => {
  const router = express.Router();
  const oauth2 = simpleOauth2.create({
    client: {
      id: options.id,
      secret: options.secret,
    },
    auth: {
      tokenHost: 'https://discordapp.com',
      tokenPath: '/api/oauth2/token',
      revokePath: '/api/oauth2/token/revoke',
      authorizePath: '/api/oauth2/authorize',
    },
  });

  const authorizationURI = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${options.hostname}/auth/callback`,
    scope: Array.isArray(options.scope) ? options.scope.join(',') : options.scope,
    state: options.state,
  });

  router.get('/login', (req, res) => {
    res.redirect(authorizationURI);
  });

  router.get('/callback', (req, res) => {
    oauth2.authorizationCode.getToken({ code: req.body.code }, (err, result) => {
      if (err) {
        res.status(400).send('Authorization failed.');
        return;
      }

      jwt.sign(result, options.jwtKey, { expiresIn: result.expires_in }, (error, token) => {
        if (error) {
          res.status(500).send('Could not create a JWT.');
          return;
        }

        res.status(200).json({ token });
      });
    });
  });

  return router;
};
