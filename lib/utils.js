'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { POST_TYPE, STORY_TYPE, HIGHLIGHTS_TYPE } = require('./constants');

const downloadFile = async (url) => {
  const { data: file } = await axios.get(url, {
    responseType: 'stream',
  });

  const pathname = new URL(url).pathname;
  const levels = pathname.split('/');
  const filePath = path.join(__dirname, `/../downloads/${levels.pop()}`);

  file.pipe(fs.createWriteStream(filePath));

  return new Promise((resolve, reject) => {
    file.on('end', resolve);
    file.on('error', reject);
  });
};

const calcUrlType = (url) => {
  const pathname = new URL(url).pathname;
  if (pathname.includes(POST_TYPE)) return POST_TYPE;
  if (pathname.includes(HIGHLIGHTS_TYPE)) return HIGHLIGHTS_TYPE;
  if (pathname.includes(STORY_TYPE)) return STORY_TYPE;
  return '';
};

const isString = (string) => typeof string === 'string';

module.exports = { calcUrlType, downloadFile, isString };
