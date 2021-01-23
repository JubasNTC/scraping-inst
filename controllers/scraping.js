'use strict';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const ERROR_MESSAGE = {
  error: 'Probably the link is not working or the wrong type is selected.',
};

const TYPES_LIST = new Set([
  'photo',
  'video',
  'stories-photo',
  'stories-video',
]);

const isValidParams = (url, type) =>
  typeof url === 'string' && url.length > 0 && TYPES_LIST.has(type);

const scrapeInstagram = async (req, res, next) => {
  const {
    body: { url, type },
  } = req;

  if (!isValidParams(url, type)) {
    return res.status(404).send(ERROR_MESSAGE);
  }

  const browser = await puppeteer.launch({
    args: ['--incognito'],
    headless: false,
  });

  try {
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

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    let resultUrl = '';

    switch (type) {
      case 'photo':
        const imgUrl = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('FFVAD'))[0].src;
        });
        resultUrl = imgUrl._remoteObject.value;
        break;

      case 'video':
        const $ = cheerio.load(await page.content());
        resultUrl = $("meta[property='og:video']").attr('content');
        break;

      case 'stories-photo':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const photoStories = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('y-yJ5'))[0].src;
        });
        resultUrl = photoStories._remoteObject.value;
        break;

      case 'stories-video':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const videoStories = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByTagName('source'))[0].src;
        });
        resultUrl = videoStories._remoteObject.value;
        break;

      default:
        break;
    }

    res.status(200).send({ url: resultUrl });
  } catch (e) {
    res.status(400).send(ERROR_MESSAGE);
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeInstagram,
};
