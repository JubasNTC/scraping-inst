'use strict';

const express = require('express');

const instagramController = require('./instagram.controller');

const router = express.Router();

router.get('/', instagramController.dashboard);

router.post('/', instagramController.scrape);

module.exports = router;
