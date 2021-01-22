'use strict';

const express = require('express');
const router = express.Router();
const scrapingController = require('../controllers/scraping');

router.post('/instagram', scrapingController.scrapeInstagram);

module.exports = router;
