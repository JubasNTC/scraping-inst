'use strict';

const express = require('express');

const instagramRouter = require('../api/instagram/instagram.router');

const router = express.Router();

router.use('/instagram', instagramRouter);

router.get('/favicon.ico', (req, res) => res.sendStatus(200));

module.exports = router;
