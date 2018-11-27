var cookieSession = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var User = require('./models/user');

function init(app) {
  // cookies are used to remember who is logged in
  app.use(cookieSession({
    name: 'session',
    keys: ["boofoowho"],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));

  // configure auth
  app.use(passport.initialize());
  app.use(passport.session());

  // flash messaging
  app.use(flash());

  // passport config
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

module.exports.init = init;