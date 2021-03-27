'use strict';

const INSTAGRAM_LOGIN_URL = 'https://www.instagram.com/accounts/login';

const INSTAGRAM_BASE_URL = 'https://www.instagram.com/';

const USERNAME_INPUT_FIELD = 'input[name=username]';

const PASSWORD_INPUT_FIELD = 'input[name=password]';

const BUTTON_SUBMIT = 'button[type=submit]';

const STORY_IMG_SELECTOR = 'img.y-yJ5';

const SOURCE_TAG = 'source';

const HIGHLIGHTS_BUTTON = 'button.FhutL';

const HIGHLIGHTS_SLIDER_ITEM = 'eXle2';

const HIGHLIGHTS_CELL = '_7zQEa';

const WATCH_BUTTON = 'button.sqdOP';

const INFO_PARAMETR = '?__a=1';

const POST_TYPE = '/p/';

const STORY_TYPE = '/stories/';

const HIGHLIGHTS_TYPE = '/stories/highlights/';

const FAILED_SCRAPE_LINK = 'Failed to scrape the link.';

const LINK_NOT_PASSED = 'Link was not passed.';

const UNKNOW_LINK_TYPE = 'Unknown link type.';

const COULD_NOT_OPEN_BROWSER = `Couldn't open the browser.`;

const TYPING_OPTIONS = { delay: 20 };

const REDIRECT_OPTIONS = { waitUntil: 'networkidle2' };

module.exports = {
  BUTTON_SUBMIT,
  HIGHLIGHTS_BUTTON,
  HIGHLIGHTS_CELL,
  HIGHLIGHTS_SLIDER_ITEM,
  INFO_PARAMETR,
  INSTAGRAM_BASE_URL,
  INSTAGRAM_LOGIN_URL,
  USERNAME_INPUT_FIELD,
  PASSWORD_INPUT_FIELD,
  STORY_IMG_SELECTOR,
  SOURCE_TAG,
  REDIRECT_OPTIONS,
  TYPING_OPTIONS,
  POST_TYPE,
  STORY_TYPE,
  HIGHLIGHTS_TYPE,
  WATCH_BUTTON,
  FAILED_SCRAPE_LINK,
  LINK_NOT_PASSED,
  UNKNOW_LINK_TYPE,
  COULD_NOT_OPEN_BROWSER,
};
