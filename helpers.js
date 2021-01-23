'use strict';

const { TYPES_LIST } = require('./constants');

const isValidParams = (type, url) => {
  return typeof url === 'string' && url.length > 0 && TYPES_LIST[type];
};

module.exports = {
  isValidParams,
};
