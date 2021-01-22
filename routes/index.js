'use strict';

const express = require('express');
const router = express.Router();
const scrapingRoutes = require('./scraping');

router.use('/scraping', scrapingRoutes);

module.exports = router;
