var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var utils = require('../utils/utils');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.render('dashboard', {});
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login', {});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});

module.exports = router;
