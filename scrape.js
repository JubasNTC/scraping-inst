'use strict';

require('dotenv').config();

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const terminalLink = require('terminal-link');

const ERROR_MESSAGE = {
  error: 'Probably the link is not working or the wrong type is selected.',
};

const TYPES_LIST = new Set([
  'photo',
  'video',
  'stories-photo',
  'stories-video',
  'stories-high',
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

    let link = '';

    // execution of the specified type, except for the video type
    switch (type) {
      case 'photo':
        const imgURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('FFVAD'))[0].src;
        });
        link = terminalLink('', imgURL._remoteObject.value);
        console.log(link);
        break;

      case 'stories-photo':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const photoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('y-yJ5'))[0].src;
        });
        link = terminalLink('', photoStoriesURL._remoteObject.value);
        console.log(link);
        break;

      case 'stories-video':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(2000);
        const videoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByTagName('source'))[0].src;
        });
        link = terminalLink('', videoStoriesURL._remoteObject.value);
        console.log(link);
        break;

      case 'stories-high':
        await page.click('button._42FBe', { delay: 20 });
        await page.waitForTimeout(1000);
        const count = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('_7zQEa')).length;
        });
        const userURL = await page.evaluateHandle(() => {
          return Array.from(
            document.getElementsByClassName('FPmhX notranslate  _1PU_r')
          )[0].href;
        });

        const $ = cheerio.load(await page.content());
        const title = $("meta[property='og:title']").attr('content');
        const [nameHigh] = title.split(' - ');

        await page.goto(userURL._remoteObject.value, {
          waitUntil: 'networkidle2',
        });
        await page.waitForTimeout(3000);

        const tee = await page.evaluateHandle((nameHigh) => {
          const el = Array.from(
            document.getElementsByClassName('eXle2')
          ).filter((el) => el.innerHTML === nameHigh)[0];
          return el;
        }, nameHigh);

        await tee.click();
        await tee.click();
        await page.waitForTimeout(3000);

        for (let i = 0; i < count._remoteObject.value; i++) {
          const storiesURL = await page.evaluateHandle(() => {
            const videoHigh = Array.from(
              document.getElementsByTagName('source')
            )[0];
            const photoHigh = Array.from(
              document.getElementsByTagName('img')
            )[0];
            return videoHigh ? videoHigh.src : photoHigh.src;
          });
          link = terminalLink(`${i + 1}: `, storiesURL._remoteObject.value);
          console.log(link);
          await page.click('button.FhutL', { delay: 20 });
          await page.waitForTimeout(1000);
        }
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
