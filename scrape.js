'use strict';

require('dotenv').config();

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

const ERROR_MESSAGE = {
  error: 'Probably the link is not working or the wrong type is selected.',
};

const TYPES_LIST = new Set([
  'photo',
  'video',
  'stories-photo',
  'stories-video',
]);

const isValidParams = (type, url) => {
  return typeof url === 'string' && url.length > 0 && TYPES_LIST.has(type);
};

const getVideo = async (url) => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const videoString = $("meta[property='og:video']").attr('content');
  return videoString;
};

// parse command line arguments
const [, , type, url] = process.argv;

(async () => {
  if (!isValidParams(type, url)) {
    return console.dir(ERROR_MESSAGE);
  }

  // if type === video case
  if (type === 'video') {
    const videoURL = await getVideo(url);
    return console.dir(videoURL);
  }

  // create browser instance
  const browser = await puppeteer.launch({
    args: ['--incognito'],
    headless: false,
  });

  try {
    // authorization
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login', {
      waitUntil: 'networkidle2',
    });
    await page.type('input[name=username]', process.env.INST_USERNAME, {
      delay: 20,
    });
    await page.type('input[name=password]', process.env.INST_PASSWORD, {
      delay: 20,
    });
    await page.click('button[type=submit]', { delay: 20 });
    await page.waitForTimeout(5000);

    // redirect to the specified url
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    // execution of the specified type, except for the video type
    switch (type) {
      case 'photo':
        const imgURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('FFVAD'))[0].src;
        });
        console.dir(imgURL._remoteObject.value);
        break;

      case 'stories-photo':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const photoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('y-yJ5'))[0].src;
        });
        console.dir(photoStoriesURL._remoteObject.value);
        break;

      case 'stories-video':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const videoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByTagName('source'))[0].src;
        });
        console.dir(videoStoriesURL._remoteObject.value);
        break;

      default:
        break;
    }
  } catch (e) {
    console.dir(ERROR_MESSAGE);
  } finally {
    await browser.close();
  }
})();
