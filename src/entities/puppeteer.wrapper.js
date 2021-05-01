'use strict';

const puppeteer = require('puppeteer');

class PuppeteerWrapper {
  constructor() {
    this._browser = null;
    this._page = null;
  }

  async launchBrowser(options = {}) {
    this._browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
      ],
      ...options,
    });

    this._page = await this._browser.newPage();
  }

  async closeBrowser() {
    if (this._browser) {
      await this._browser.close();
    }
  }

  async getCookie() {
    return await this._page.cookies();
  }

  async setCookie(cookie) {
    await this._page.setCookie(...cookie);
  }
}

module.exports = PuppeteerWrapper;
