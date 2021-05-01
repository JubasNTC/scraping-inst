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
    const userPost = await scraper.getUserPost(url);

    parentPort.postMessage({ error: null, data: userPost });
  } catch {
    parentPort.postMessage({
      error: new Error('Failed scrape user post.'),
      data: null,
    });
  }
})();
