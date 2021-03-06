var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


//require new routes
var index = require('./routes/index');
var search = require('./routes/search');
var emailSignUp = require('./routes/emailSignUp');
var createAccount = require('./routes/createAccount');
var addUser = require('./routes/addUser');


var app = express();

// view engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// allow local client to make requests to API
app.use(function enableCORSMiddleware (req,res,next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//use routes
app.use('/', index);
app.use('/', search);
app.use('/', createAccount);
app.use('/', emailSignUp);
app.use('/', addUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Connection URL


module.exports = app;
