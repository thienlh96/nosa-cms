var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const session = require('express-session');
const bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});

module.exports = app;
