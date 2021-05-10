'use strict';

require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');

const app = require('./app');
const instagramService = require('./services/instagram.service');
const { saveCookies } = require('./utils/cookies');

(async () => {
  try {
    const cookies = await instagramService.login();

    const varPath = path.join(__dirname, `../var`);

    if (!fs.existsSync(varPath)) {
      fs.mkdirSync(varPath);
    }

    await saveCookies(cookies);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const server = http.createServer(app);

  const port = process.env.PORT || 1337;

  server.listen(port, () => {
    console.log(`Dashboard URL: http://localhost:${port}/api/instagram`);
  });
})();
