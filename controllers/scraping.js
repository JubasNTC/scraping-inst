'use strict';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const scrapeInstagram = async (req, res, next) => {
  const {
    body: { url, type },
  } = req;

  try {
    const browser = await puppeteer.launch({
      args: ['--incognito'],
      headless: false,
    });
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

    await page.waitFor(5000);

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitFor(3000);

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

      case 'stories':
        const videoStories = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByTagName('source'))[0].src;
        });
        if (videoStories.length) {
          resultUrl = videoStories;
        } else {
          const photoStories = await page.evaluateHandle(() => {
            return Array.from(document.getElementsByTagName('img'))[0].src;
          });
          resultUrl = photoStories;
        }
        break;

      default:
        break;
    }

    await browser.close();

    return res.status(200).send({ url: resultUrl });
  } catch (e) {
    return res.status(400).send(e);
  }
};

module.exports = {
  scrapeInstagram,
};
