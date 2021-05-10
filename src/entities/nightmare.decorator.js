'use strict';

const Nightmare = require('nightmare');

class NightmareDecorator {
  constructor() {
    this._nightmare = Nightmare({ show: false, typeInterval: 20 });
  }

  async goto(url, cookies = []) {
    await this._nightmare.goto(url);

    if (cookies.length > 0) {
      await this._nightmare.cookies.set(cookies);
      await this._nightmare.refresh();
    }
  }

  async getCookies() {
    return await this._nightmare.cookies.get();
  }

  async closeBrowser() {
    await this._nightmare.end();
  }
}

module.exports = NightmareDecorator;
