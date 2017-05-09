const jwt = require('jsonwebtoken');
const oauth2 = require('simple-oauth2');

module.exports = (req, res, next) => {
  if (req.get('authorization')) {
    let token = req.get('authorization').match(/Bearer (.*)/);
    if (!token) {
      res.status(401).send('Invalid authorization.');
      return;
    }
    token = token[1];

    jwt.verify(token, req.app.get('config').jwtKey, (err, decoded) => {
      if (err) {
        res.status(401).send('Invalid authorization.');
      } else {
        req.user = oauth2.accessToken.create(decoded);
        next();
      }
    });
  } else {
    res.status(401).send('No authorization provided.');
  }
};
