'use strict';

const express = require('express');
const router = express.Router();
const scrapingRoutes = require('./scraping');
const testRoutes = require('./test');

router.use('/scraping', scrapingRoutes);

router.use('/test', testRoutes);

module.exports = router;
