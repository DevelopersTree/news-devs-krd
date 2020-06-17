const express = require('express');
require('dotenv').config();

const app = express();
const linksRouter = require('./routes/links');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/link', linksRouter);

module.exports = app;
