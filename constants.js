'use strict';

const TYPES_LIST = {
  photo: 'photo',
  video: 'video',
  'stories-photo': 'stories-photo',
  'stories-video': 'stories-video',
};

const ERROR_MESSAGE = {
  error: 'Probably the link is not working or the wrong type is selected.',
};

const BROWSER_CONFIG = {
  args: ['--incognito'],
  headless: false,
};

const BUTTON_TOUCH_STYLE = 'button._42FBe';

const PHOTO_STYLE = 'FFVAD';

const PHOTO_STORIES_STYLE = 'y-yJ5';

const VIDEO_STORIES_TAG = 'source';

const VIDEO_TAG = "meta[property='og:video']";

const VIDEO_TAG_ATTRIBUTE = 'content';

const INST_LOGIN_URL = 'https://www.instagram.com/accounts/login';

const USERNAME_INPUT_TAG = 'input[name=username]';

const PASSWORD_INPUT_TAG = 'input[name=password]';

const SUBMIT_FORM_TAG = 'button[type=submit]';

const REDIRECT_CONFIG = {
  waitUntil: 'networkidle2',
};

const DOM_ACTION_OPTIONS = {
  delay: 20,
};

module.exports = {
  BROWSER_CONFIG,
  BUTTON_TOUCH_STYLE,
  ERROR_MESSAGE,
  INST_LOGIN_URL,
  PHOTO_STORIES_STYLE,
  PHOTO_STYLE,
  TYPES_LIST,
  VIDEO_STORIES_TAG,
  VIDEO_TAG,
  VIDEO_TAG_ATTRIBUTE,
  USERNAME_INPUT_TAG,
  PASSWORD_INPUT_TAG,
  SUBMIT_FORM_TAG,
  REDIRECT_CONFIG,
  DOM_ACTION_OPTIONS,
};
