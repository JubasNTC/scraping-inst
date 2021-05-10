'use strict';

const { workerData, parentPort } = require('worker_threads');

const InstagramScraper = require('../entities/instagram.scraper');

(async () => {
  const { cookies, url } = workerData;

  const scraper = new InstagramScraper(cookies);

  try {
    const userHighlights = await scraper.getUserHighlight(url);

    parentPort.postMessage({ error: null, data: userHighlights });
  } catch (error) {
    parentPort.postMessage({
      error,
      data: null,
    });
  } finally {
    await scraper.closeBrowser();
  }
})();
