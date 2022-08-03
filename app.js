const cors = require('cors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var appRouter = require('./routes/index');

var app = express();

app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', appRouter);

module.exports = app;
