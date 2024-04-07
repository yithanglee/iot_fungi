var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
const fs = require('fs');

// Source directory; this should already exist
const srcDir = path.join(__dirname, 'internal/html');
console.log(srcDir)
// Destination directory; this is where you want to create the symlink
const destDir = path.join(__dirname, 'public/html/v2');

// Create the symbolic link
fs.symlink(srcDir, destDir, 'dir', (err) => {
  if (err) {
    console.error('Error creating symlink:', err);
  } else {
    console.log('Symlink created successfully');
  }
});

var app = express();


// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {

      defaultSrc: ["'self'"],
      "script-src-attr": ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'openstreetmap.org'],
      // styleSrc: ["'self'", 'openstreetmap.org'],
      imgSrc: ["'self'", "localhost:4000", "localhost:8512", "blog.damienslab.com", 'tile.openstreetmap.org', '*.tile.openstreetmap.org'],
      // connectSrc: ["'self'", 'openstreetmap.org'],
      // fontSrc: ["'self'", 'openstreetmap.org'],
    },
  }),
);

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 5 minute
  max: 500,
});
// Apply rate limiter to all requests
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/webhook', apiRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
