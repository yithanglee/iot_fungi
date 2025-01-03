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


// Function to create the symlink
function createSymlink() {
  fs.symlink(srcDir, destDir, 'dir', (err) => {
    if (err) {
      console.error('Error creating symlink:', err);
    } else {
      console.log('Symlink created successfully');
    }
  });
}

// Check if the symlink already exists
fs.access(destDir, fs.constants.F_OK, (err) => {
  if (!err) {
    // Symlink exists, delete it first
    fs.unlink(destDir, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting symlink:', unlinkErr);
      } else {
        console.log('Symlink deleted successfully');
        createSymlink();
      }
    });
  } else {
    // Symlink does not exist, create it directly
    createSymlink();
  }
});
var app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // Allow form submissions to the domain (without specifying the exact path)
      "form-action": ["*"],
      
      // Other CSP directives
      defaultSrc: ["'self'"],
      "script-src-attr": ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://openstreetmap.org"],
      imgSrc: ["'self'", "http://localhost:5126", "https://blog.damienslab.com", "https://tile.openstreetmap.org", "https://*.tile.openstreetmap.org"],
    },
  })
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
// Middleware to extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host;
  // Split the host by '.' and assume the first part is the subdomain
  const subdomain = host.split('.')[0];

  // Optional: Ignore 'www' as a subdomain
  if (subdomain === 'www') {
    req.subdomain = null;  // or you could reassign it to something else
  } else {
    req.subdomain = subdomain;
  }

  next();
});

app.post('/process_form', (req, res) => {
  // Extract data and process it if needed
  const { chan, amt, ref_no } = req.body;

  // Perform a server-side redirect to the final destination
  res.redirect(`https://blog.damienslab.com/test_razer?chan=${chan}&amt=${amt}&ref_no=${ref_no}`);
  // res.redirect(`http://localhost:4000/test_razer?chan=${chan}&amt=${amt}&ref_no=${ref_no}`);

});


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
