'use strict';

const { parentPort } = require('worker_threads');

const InstagramScraper = require('../entities/instagram.scraper');

(async () => {
  const scraper = new InstagramScraper();

  try {
    await scraper.login();

    const cookies = await scraper.getCookies();

    parentPort.postMessage({ error: null, data: cookies });
  } catch (error) {
    parentPort.postMessage({
      error,
      data: null,
    });
  } finally {
    await scraper.closeBrowser();
  }
})();
