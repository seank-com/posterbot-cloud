
/**
 * Module dependencies.
 */
var debug = require('debug');
var debugHttp = debug('http');
var debugApp = debug('app');

var http = require('http');
var createError = require('http-errors');
var express = require('express');
var busboy = require('connect-busboy');
var path = require('path');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var cookieSession = require('cookie-session');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var database = require('./services/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// configure middleware
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger(':remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
  name: 'session',
  keys: ["boofoowho"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  debugApp('creating 404');
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  var status = err.status || 500;
  res.status(status);
  debugApp('rendering error page for ' + status);
  res.render('error');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debugHttp('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

database.init((err) => {
  if (err) {
    debugApp('database connection failed ');
    console.error(err);
    process.exit(1);
  } else {
    debugApp('starting server');
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  }
});

process.on('SIGTERM', () => {
  database.close(()=> {
    debugApp('exiting process');
    process.exit(0);
  });
});
