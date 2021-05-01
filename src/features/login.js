'use strict';

const { parentPort } = require('worker_threads');

const PuppeteerInstagram = require('../entities/puppeteer.instagram');

(async () => {
  const scraper = new PuppeteerInstagram();

  try {
    await scraper.launchBrowser({ headless: false });
  } catch {
    parentPort.postMessage({
      error: new Error('Failed to start the browser.'),
      data: null,
    });
  }

  try {
    await scraper.login();

    const cookie = await scraper.getCookie();

    parentPort.postMessage({ error: null, data: cookie });
  } catch (e) {
    parentPort.postMessage({
      error: new Error('Failed authorization.'),
      data: null,
    });
  } finally {
    await scraper.closeBrowser();
  }
})();
