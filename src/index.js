'use strict';

const http = require('http');

const app = require('./app');
const instagramService = require('./services/instagram.service');
const { saveCookie } = require('./utils/cookie');

(async () => {
  try {
    const cookie = await instagramService.login();

    await saveCookie(cookie);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const server = http.createServer(app);

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`Dashboard URL: http://localhost:${port}/api/instagram`);
  });
})();
