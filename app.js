require('dotenv').config();
let cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serverless = require('serverless-http');
var indexRouter = require('./api/index');
var usersRouter = require('./api/users');

var app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
/* function pagination(req, res, next) {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit);
    req.start = start;
    req.end = end;
    req.id = req.params.id;
    req.limit = 3;
    next();
} */
// app.use('/', pagination, indexRouter);
module.exports = app;
