'use strict';

require('dotenv').config();

const axios = require('axios');

const {
  BUTTON_SUBMIT,
  HIGHLIGHTS_BUTTON,
  HIGHLIGHTS_CELL,
  HIGHLIGHTS_SLIDER_ITEM,
  INFO_PARAMETR,
  INSTAGRAM_BASE_URL,
  INSTAGRAM_LOGIN_URL,
  REDIRECT_OPTIONS,
  TYPING_OPTIONS,
  USERNAME_INPUT_FIELD,
  PASSWORD_INPUT_FIELD,
  SOURCE_TAG,
  STORY_IMG_SELECTOR,
  WATCH_BUTTON,
} = require('./constants');

const logIn = async (page) => {
  await page.goto(INSTAGRAM_LOGIN_URL, REDIRECT_OPTIONS);
  await page.type(
    USERNAME_INPUT_FIELD,
    process.env.INST_USERNAME,
    TYPING_OPTIONS
  );
  await page.type(
    PASSWORD_INPUT_FIELD,
    process.env.INST_PASSWORD,
    TYPING_OPTIONS
  );
  await page.click(BUTTON_SUBMIT, TYPING_OPTIONS);
  await page.waitForTimeout(5000);
};

const getUserPost = async (url) => {
  const {
    data: {
      graphql: {
        shortcode_media: {
          display_url,
          is_video,
          video_url,
          edge_sidecar_to_children,
        },
      },
    },
  } = await axios.get(`${url}${INFO_PARAMETR}`);

  const nodesList = edge_sidecar_to_children?.edges;

  if (Array.isArray(nodesList)) {
    return nodesList.map(({ node: { display_url, is_video, video_url } }) =>
      is_video ? video_url : display_url
    );
  }

  return is_video ? [video_url] : [display_url];
};

const getUserStory = async (page, url) => {
  await page.goto(url, REDIRECT_OPTIONS);
  await page.click(WATCH_BUTTON, TYPING_OPTIONS);
  await page.waitForSelector(STORY_IMG_SELECTOR);

  const {
    _remoteObject: { value: videoStoryUrl },
  } = await page.evaluateHandle((tag) => {
    return Array.from(document.getElementsByTagName(tag))[0]?.src;
  }, SOURCE_TAG);
  if (videoStoryUrl) {
    return [videoStoryUrl];
  }

  const {
    _remoteObject: { value: photoStoryUrl },
  } = await page.evaluateHandle((selector) => {
    const { srcset } = Array.from(document.querySelectorAll(selector))[0];
    const [maxQuality] = srcset.split(' ');
    return maxQuality;
  }, STORY_IMG_SELECTOR);
  return [photoStoryUrl];
};

const getUserHighlights = async (page, url) => {
  const {
    data: {
      user: { username },
      highlight: { title },
    },
  } = await axios.get(`${url}${INFO_PARAMETR}`);

  await page.goto(`${INSTAGRAM_BASE_URL}${username}`, REDIRECT_OPTIONS);

  const sliderItem = await page.evaluateHandle(
    (title, className) => {
      return Array.from(document.getElementsByClassName(className)).filter(
        ({ innerHTML }) => innerHTML === title
      )[0];
    },
    title,
    HIGHLIGHTS_SLIDER_ITEM
  );

  await sliderItem.click();
  await sliderItem.click();

  await page.waitForSelector(STORY_IMG_SELECTOR);

  const {
    _remoteObject: { value: highlightsCount },
  } = await page.evaluateHandle((cell) => {
    return Array.from(document.getElementsByClassName(cell)).length;
  }, HIGHLIGHTS_CELL);

  const result = [];

  for (let i = 0; i < highlightsCount; i++) {
    await page.waitForSelector(STORY_IMG_SELECTOR);

    const {
      _remoteObject: { value: videoStoryUrl },
    } = await page.evaluateHandle((tag) => {
      return Array.from(document.getElementsByTagName(tag))[0]?.src;
    }, SOURCE_TAG);

    const {
      _remoteObject: { value: photoStoryUrl },
    } = await page.evaluateHandle((selector) => {
      const { srcset } = Array.from(document.querySelectorAll(selector))[0];
      const [maxQuality] = srcset.split(' ');
      return maxQuality;
    }, STORY_IMG_SELECTOR);

    result.push(videoStoryUrl || photoStoryUrl);

    await page.click(HIGHLIGHTS_BUTTON, TYPING_OPTIONS);
  }

  return result;
};

module.exports = { getUserPost, getUserStory, getUserHighlights, logIn };
