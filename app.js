const express = require('express');
require('dotenv').config();

const app = express();
const linksRouter = require('./routes/links');
const blackListRouter = require('./routes/blacklist');
const publisherRouter = require('./routes/publisher');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/link', linksRouter);
app.use('/publisher', publisherRouter);

// bellow route should not be public its for backend development in the future
app.use('/blacklist', blackListRouter);

module.exports = app;
