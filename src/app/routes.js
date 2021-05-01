'use strict';

const express = require('express');

const instagramRouter = require('../api/instagram/instagram.router');

const router = express.Router();

const ROUTES_MAP = [
  {
    path: '/instagram',
    parent: instagramRouter,
  },
];

ROUTES_MAP.forEach(({ path, parent }) => {
  router.use(path, parent);
});

module.exports = router;
