
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

// setup favicon before logging so that 
// we don't fill our logs with useless data
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

// verbose logging
app.use(logger(':remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

// setup body-parser (now included in Express)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookies are used to remember who is logged in
app.use(cookieSession({
  name: 'session',
  keys: ["boofoowho"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// configure auth
app.use(passport.initialize());
app.use(passport.session());

// setup serve-static (now included in Express)
app.use(express.static(path.join(__dirname, 'public')));

// mime upload support
app.use(busboy());

// flash messaging
app.use(flash());

// Setup Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// Normalize a port into a number, string, or false.
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

// Event listener for HTTP server "error" event.
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

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debugHttp('Listening on ' + bind);
}

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

// connect to database, we are nothing without data
database.init((err) => {
  if (err) {
    debugApp('database connection failed ');
    console.error(err);
    process.exit(1);
  } else {
    // Listen on provided port, on all network interfaces.
    debugApp('starting server');
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  }
});

// docker send a SIGTERM for graceful shutdown, 
// lets atleast try to be a good citizen.
process.on('SIGTERM', () => {
  database.close(()=> {
    debugApp('exiting process');
    process.exit(0);
  });
});
