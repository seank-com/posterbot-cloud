var debugRoutes = require('debug')('routes');
var createError = require('http-errors');

var indexRouter = require('./routes/index');
var postersRouter = require('./routes/posters');
var themesRouter = require('./routes/themes');
var usersRouter = require('./routes/users');

function init(app) {
  // Setup Routes
  app.use('/', indexRouter);
  app.use('/posters', postersRouter);
  app.use('/themes', themesRouter);
  app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    debugRoutes('creating 404');
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
    debugRoutes('rendering error page for ' + status);
    res.render('error');
  });
}

module.exports.init = init;