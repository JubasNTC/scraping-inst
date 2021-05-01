'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const instagramService = require('./services/instagram.service');
const { saveCookie } = require('./utils/cookie');

(async () => {
  try {
    const cookie = await instagramService.login();

    const varPath = path.join(__dirname, `../var`);

    if (!fs.existsSync(varPath)) {
      fs.mkdirSync(varPath);
    }

    await saveCookie(cookie);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
