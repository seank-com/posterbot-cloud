var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var utils = require('./utils');

var router = express.Router();

var context = {
  title: 'Posterbot'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    context.user = utils.getUser(req);
    context.msgs = req.flash('msgs');
    res.render('dashboard', context);
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  context.user = utils.getUser(req);
  context.msgs = req.flash('msgs');
  res.render('login', context);
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
