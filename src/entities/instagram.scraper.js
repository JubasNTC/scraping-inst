'use strict';

const NightmareDecorator = require('./nightmare.decorator');

class InstagramScraper extends NightmareDecorator {
  constructor(cookies = []) {
    super();

    this._cookies = cookies;
  }

  async login() {
    await this._nightmare.goto('https://www.instagram.com/accounts/login/');

    await this._nightmare.wait('input[name="username"]');

    await this._nightmare.type(
      'input[name="username"]',
      process.env.INST_USERNAME
    );
    await this._nightmare.type(
      'input[name="password"]',
      process.env.INST_PASSWORD
    );

    await this._nightmare.click('button[type="submit"]');

    await this._nightmare.wait('div._47KiJ');
  }

  async getUserPost(url) {
    await this._nightmare.goto(`${url}?__a=1`);

    await this._nightmare.wait('pre');

    const userPostJson = await this._nightmare.evaluate(
      () => document.querySelector('pre').innerHTML
    );

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
    await this.goto(url, this._cookies);

    await this._nightmare.wait('button.sqdOP');
    await this._nightmare.click('button.sqdOP');
    await this._nightmare.wait('img.y-yJ5');

    const videoUrl = await this._nightmare.evaluate(() => {
      const videoNode = document.querySelector('source');

      return videoNode ? videoNode.src : null;
    });

    if (videoUrl) {
      return [videoUrl];
    }

    const photoUrl = await this._nightmare.evaluate(() => {
      const { srcset } = document.querySelector('img.y-yJ5');
      const [maxQuality] = srcset.split(' ');

      return maxQuality;
    });

    return [photoUrl];
  }

  async getUserHighlight(url) {
    await this.goto(`${url}?__a=1`, this._cookies);

    await this._nightmare.wait('pre');

    const highlightJson = await this._nightmare.evaluate(
      () => document.querySelector('pre').innerHTML
    );

    const parsedData = JSON.parse(highlightJson);

    const {
      user: { username },
      highlight: { title },
    } = parsedData;

    await this._nightmare.goto(`https://www.instagram.com/${username}`);

    await this._nightmare.wait('div.eXle2');

    await this._nightmare.evaluate((title) => {
      const [highlightNode] = Array.from(
        document.getElementsByClassName('eXle2')
      ).filter(({ innerHTML }) => innerHTML === title);

      highlightNode.click();
    }, title);

    await this._nightmare.wait('img.y-yJ5');

    const highlightsCount = await this._nightmare.evaluate(
      () => Array.from(document.getElementsByClassName('_7zQEa')).length
    );

    const highlightsUrls = [];

    for (let i = 0; i < highlightsCount; i++) {
      await this._nightmare.wait('img.y-yJ5');

      const videoUrl = await this._nightmare.evaluate(() => {
        const videoNode = document.querySelector('source');

        return videoNode ? videoNode.src : null;
      });

      const photoUrl = await this._nightmare.evaluate(() => {
        const { srcset } = document.querySelector('img.y-yJ5');
        const [maxQuality] = srcset.split(' ');

        return maxQuality;
      });

      highlightsUrls.push(videoUrl || photoUrl);

      await this._nightmare.click('button.FhutL');
    }

    return highlightsUrls;
  }
}

module.exports = InstagramScraper;
