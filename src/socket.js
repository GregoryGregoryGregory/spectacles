const ws = require('ws');

module.exports = (server) => {
  const wss = new ws.Server({ server });

  wss.on('connection', () => {
    //
  });
};
