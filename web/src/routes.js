var debugRoutes = require('debug')('routes');
var createError = require('http-errors');

var indexRoutes = require('./routes/index');
var apiRoutes = require('./routes/api');
var postersRoutes = require('./routes/posters');
var themesRoutes = require('./routes/themes');
var usersRoutes = require('./routes/users');

function init(app) {
  // Setup Routes
  app.use('/', indexRoutes);
  app.use('/api', apiRoutes);
  app.use('/posters', postersRoutes);
  app.use('/themes', themesRoutes);
  app.use('/users', usersRoutes);

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