'use strict';

const express = require('express');
const router = express.Router();
const testController = require('../controllers/test');

router.get('/enable', testController.testWorkApi);

module.exports = router;
