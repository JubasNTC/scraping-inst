'use strict';

require('dotenv').config();

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

const ERROR_MESSAGE = {
  error: 'Probably the link is not working or the wrong type is selected.',
};

const TYPES_LIST = new Set(['p', 'v', 'sp', 'sv', 'sh']);

const isValidParams = (type, url) => {
  return typeof url === 'string' && url.length > 0 && TYPES_LIST.has(type);
};

const getPhotoOrPhoto = async (url) => {
  const {
    data: {
      graphql: { shortcode_media },
    },
  } = await axios.get(`${url}?__a=1`);
  return shortcode_media.is_video
    ? shortcode_media.video_url
    : shortcode_media.display_url;
};

// parse command line arguments
const [, , type, url] = process.argv;

(async () => {
  if (!isValidParams(type, url)) {
    return console.dir(ERROR_MESSAGE);
  }

  // if video || photo case
  if (type === 'v' || type === 'p') {
    const res = await getPhotoOrPhoto(url);
    return console.dir(res);
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
    if (type !== 'sh') {
      await page.goto(url, { waitUntil: 'networkidle2' });
    }

    // execution of the specified type, except for the video type
    switch (type) {
      case 'sp':
        await page.click('button.sqdOP', { delay: 20 });
        await page.waitForTimeout(2000);
        const photoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('y-yJ5'))[0].src;
        });
        console.dir(photoStoriesURL._remoteObject.value);
        break;

      case 'sv':
        await page.click('button.sqdOP', { delay: 20 });
        await page.waitForTimeout(2000);
        const videoStoriesURL = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByTagName('source'))[0].src;
        });
        console.dir(videoStoriesURL._remoteObject.value);
        break;

      case 'sh':
        const {
          data: {
            user: { username },
            highlight: { title },
          },
        } = await axios.get(`${url}?__a=1`);

        await page.goto(`https://www.instagram.com/${username}`, {
          waitUntil: 'networkidle2',
        });

        const tee = await page.evaluateHandle((title) => {
          const el = Array.from(
            document.getElementsByClassName('eXle2')
          ).filter((el) => el.innerHTML === title)[0];
          return el;
        }, title);

        await tee.click();
        await tee.click();
        await page.waitForTimeout(3000);

        const count = await page.evaluateHandle(() => {
          return Array.from(document.getElementsByClassName('_7zQEa')).length;
        });

        for (let i = 0; i < count._remoteObject.value; i++) {
          const storiesURL = await page.evaluateHandle(() => {
            const videoHigh = Array.from(
              document.getElementsByTagName('source')
            )[0];
            const photoHigh = Array.from(
              document.getElementsByClassName('y-yJ5')
            )[0];
            return videoHigh ? videoHigh.src : photoHigh.srcset.split(' ')[0];
          });
          console.dir(`${i + 1}:`);
          console.dir(storiesURL._remoteObject.value);
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
