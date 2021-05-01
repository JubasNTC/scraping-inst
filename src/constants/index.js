'use strict';

module.exports = {
  FEATURES_MAPPING: new Map([
    ['/p/', 'post'],
    ['/stories/', 'story'],
    ['/stories/highlights/', 'highlights'],
  ]),
  INSTAGRAM_URL_REGEXP: /\/p\/|\/stories\/highlights\/|\/stories\//gi,
};
