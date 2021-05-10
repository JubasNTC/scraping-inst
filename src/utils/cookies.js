'use strict';

const fs = require('fs').promises;
const path = require('path');

const COOKIE_PATH = '../../var/cookies.json';

module.exports = {
  saveCookies: async (cookie) => {
    await fs.writeFile(
      path.join(__dirname, COOKIE_PATH),
      JSON.stringify(cookie),
      'utf-8'
    );
  },

  readCookies: async () => {
    const cookie = await fs.readFile(
      path.join(__dirname, COOKIE_PATH),
      'utf-8'
    );

    return JSON.parse(cookie);
  },
};
