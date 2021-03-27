'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const {
  POST_TYPE,
  STORY_TYPE,
  FAILED_SCRAPE_LINK,
  LINK_NOT_PASSED,
  UNKNOW_LINK_TYPE,
  COULD_NOT_OPEN_BROWSER,
} = require('./constants');
const { calcUrlType, downloadFile, isString } = require('./utils');
const {
  getUserPost,
  getUserStory,
  getUserHighlights,
  logIn,
} = require('./services');

(async () => {
  const [, , url] = process.argv;

  if (!isString(url)) {
    return console.log(LINK_NOT_PASSED);
  }

  const urlType = calcUrlType(url);

  if (!urlType) {
    return console.log(UNKNOW_LINK_TYPE);
  }

  const downloadsPath = path.join(__dirname, `/../downloads`);
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }

  if (urlType === POST_TYPE) {
    try {
      const userPost = await getUserPost(url);
      await Promise.all(userPost.map((url) => downloadFile(url)));
      return console.log(userPost.join('\n\n'));
    } catch {
      console.log(FAILED_SCRAPE_LINK);
      process.exit(1);
    }
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: false,
    });
  } catch {
    console.log(COULD_NOT_OPEN_BROWSER);
    process.exit(1);
  }

  try {
    const page = await browser.newPage();
    await logIn(page);

    const scapedData =
      urlType === STORY_TYPE
        ? await getUserStory(page, url)
        : await getUserHighlights(page, url);

    await Promise.all(scapedData.map((url) => downloadFile(url)));
    console.log(scapedData.join('\n\n'));
  } catch (error) {
    console.log(FAILED_SCRAPE_LINK);
  } finally {
    await browser.close();
  }
})();
