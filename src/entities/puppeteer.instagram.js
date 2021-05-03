'use strict';

const cheerio = require('cheerio');

const PuppeteerWrapper = require('./puppeteer.wrapper');

class PuppeteerInstagram extends PuppeteerWrapper {
  constructor() {
    super();
  }

  async login() {
    await this._page.goto('https://www.instagram.com/', {
      waitUntil: 'networkidle0',
    });

    await this._page.waitForSelector('input[name="username"]', {
      visible: true,
    });

    await this._page.type('input[name="username"]', process.env.INST_USERNAME, {
      delay: 20,
    });

    await this._page.type('input[name="password"]', process.env.INST_PASSWORD, {
      delay: 20,
    });

    await this._page.click('button[type="submit"]', { delay: 20 });

    await this._page.waitForTimeout(5000);
  }

  async getUserPost(url) {
    await this._page.goto(`${url}?__a=1`, {
      waitUntil: 'networkidle0',
    });

    await this._page.waitForSelector('pre', {
      visible: true,
    });

    const {
      _remoteObject: { value: userPostJson },
    } = await this._page.evaluateHandle(() => {
      return document.querySelector('pre').innerHTML;
    });

    const parsedData = JSON.parse(userPostJson);

    const {
      graphql: {
        shortcode_media: {
          display_url,
          is_video,
          video_url,
          edge_sidecar_to_children,
        },
      },
    } = parsedData;

    const userPostItems = edge_sidecar_to_children?.edges;

    if (Array.isArray(userPostItems)) {
      return userPostItems.map(
        ({ node: { display_url, is_video, video_url } }) => {
          const url = is_video ? video_url : display_url;

          return url.replace(/amp;/gi, '');
        }
      );
    }

    const singlePostUrl = is_video ? video_url : display_url;

    return [singlePostUrl.replace(/amp;/gi, '')];
  }

  async getUserStory(url) {
    await this._page.goto(url, {
      waitUntil: 'networkidle0',
    });
    await this._page.waitForSelector('button.sqdOP', { visible: true });
    await this._page.click('button.sqdOP', { delay: 20 });
    await this._page.waitForSelector('img.y-yJ5');

    const {
      _remoteObject: { value: videoStoryUrl },
    } = await this._page.evaluateHandle(() => {
      return Array.from(document.getElementsByTagName('source'))[0]?.src;
    });

    if (videoStoryUrl) {
      return [videoStoryUrl];
    }

    const {
      _remoteObject: { value: photoStoryUrl },
    } = await this._page.evaluateHandle(() => {
      const { srcset } = Array.from(document.querySelectorAll('img.y-yJ5'))[0];

      const [maxQuality] = srcset.split(' ');

      return maxQuality;
    });

    return [photoStoryUrl];
  }

  async getUserHighlights(url) {
    await this._page.goto(url, {
      waitUntil: 'networkidle0',
    });
    await this._page.waitForSelector('button.sqdOP', { visible: true });
    await this._page.click('button.sqdOP', { delay: 20 });
    await this._page.waitForSelector('img.y-yJ5');

    const $ = cheerio.load(await this._page.content());
    const meta = $("meta[property='og:title']").attr('content');
    const [title, username] = meta.split(' - ');
    const withoutAt = username.replace('@', '');

    await this._page.goto(`https://www.instagram.com/${withoutAt}`, {
      waitUntil: 'networkidle0',
    });

    const sliderItem = await this._page.evaluateHandle((title) => {
      return Array.from(document.getElementsByClassName('eXle2')).filter(
        ({ innerHTML }) => innerHTML === title
      )[0];
    }, title);

    await sliderItem.click();
    await sliderItem.click();

    await this._page.waitForSelector('img.y-yJ5');

    const {
      _remoteObject: { value: highlightsCount },
    } = await this._page.evaluateHandle(() => {
      return Array.from(document.getElementsByClassName('_7zQEa')).length;
    });

    const result = [];

    for (let i = 0; i < highlightsCount; i++) {
      await this._page.waitForSelector('img.y-yJ5');

      const {
        _remoteObject: { value: videoStoryUrl },
      } = await this._page.evaluateHandle(() => {
        return Array.from(document.getElementsByTagName('source'))[0]?.src;
      });

      const {
        _remoteObject: { value: photoStoryUrl },
      } = await this._page.evaluateHandle(() => {
        const { srcset } = Array.from(
          document.querySelectorAll('img.y-yJ5')
        )[0];

        const [maxQuality] = srcset.split(' ');

        return maxQuality;
      });

      result.push(videoStoryUrl || photoStoryUrl);

      await this._page.click('button.FhutL', { delay: 20 });
    }

    return result;
  }
}

module.exports = PuppeteerInstagram;
