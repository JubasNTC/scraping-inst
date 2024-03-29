'use strict';

const { workerData, parentPort } = require('worker_threads');

const InstagramScraper = require('../entities/instagram.scraper');

(async () => {
  const { cookies, url } = workerData;

  const scraper = new InstagramScraper(cookies);

  try {
    const userPost = await scraper.getUserPost(url);

    parentPort.postMessage({ error: null, data: userPost });
  } catch (error) {
    parentPort.postMessage({
      error,
      data: null,
    });
  } finally {
    await scraper.closeBrowser();
  }
})();
