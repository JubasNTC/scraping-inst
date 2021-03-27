'use strict';

const { POST_TYPE, STORY_TYPE, HIGHLIGHTS_TYPE } = require('./constants');

const calcUrlType = (url) => {
  const pathname = new URL(url).pathname;
  if (pathname.includes(POST_TYPE)) return POST_TYPE;
  if (pathname.includes(HIGHLIGHTS_TYPE)) return HIGHLIGHTS_TYPE;
  if (pathname.includes(STORY_TYPE)) return STORY_TYPE;
  return '';
};

const isString = (string) => typeof string === 'string';

module.exports = { calcUrlType, isString };
