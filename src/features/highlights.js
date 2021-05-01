'use strict';

const { workerData, parentPort } = require('worker_threads');

const PuppeteerInstagram = require('../entities/puppeteer.instagram');

(async () => {
  const { cookie, url } = workerData;

  const scraper = new PuppeteerInstagram();

  try {
    await scraper.launchBrowser();
    await scraper.setCookie(cookie);
  } catch {
    parentPort.postMessage({
      error: new Error('Failed to start the browser.'),
      data: null,
    });
  }

  try {
    const userHighlights = await scraper.getUserHighlights(url);

    parentPort.postMessage({ error: null, data: userHighlights });
  } catch {
    parentPort.postMessage({
      error: new Error('Failed scrape user highlights.'),
      data: null,
    });
  } finally {
    await scraper.closeBrowser();
  }
})();
