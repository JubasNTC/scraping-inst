'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const mainRouter = require('./routes');

const PORT = process.env.PORT || 80;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} port...`);
});
