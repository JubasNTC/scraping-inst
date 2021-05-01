'use strict';

require('dotenv').config();

const http = require('http');

const app = require('./app');

(async () => {
  const server = http.createServer(app);

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Working on http://localhost:${port}/api/instagram`);
  });
})();
