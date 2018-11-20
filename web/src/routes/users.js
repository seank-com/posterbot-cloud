var express = require('express');
var utils = require('./utils');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

function getContext(action, req, data) {
  var context = {
    location: 'Users',
    title: 'Users',
    description: 'The people that can log in and make changes to the system.'
  }, selected = 0, user;

  context.user = utils.getUser(req);

  if (action === 'list') {
    context.users = data
      .filter(user => user.id !== req.user.id)
      .sort((a,b) => {
        var nameA = a.fullname.toUpperCase();
        var nameB = b.fullname.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      })
      .map((user) => {
        return {
          avatar: user.avatar,
          id: user.id,
          fullname: user.fullname,
          jobtitle: user.jobtitle
        };
      });
    return context;
  } else {
    context.avatars = [ 
      'male', 'female',
      'doctor', 'nurse',
      'actor', 'actress',
      'detective', 'secretary',
      'cop', 'stewardess',
      'janitor', 'maid',
      'priest', 'nun',
      'demon', 'angel', 
      'astronaut', 'uhura',
      'alien', 'diva',
      'robot', 'fembot',
      'king', 'queen',
      'moustache', 'mermaid',
      'ninja', 'catwoman', 'succubus', 'fairy'
    ];

    if (action === 'add') {
      selected = Math.floor(Math.random() * context.avatars.length);
      context.avatars = context.avatars.map((val, idx) => {
        return {
          value: val,
          name: utils.initialCap(val),
          checked: (selected === idx) ? 'checked' : ''
        };
      });
      context.title = 'Add User';
      context.actiontitle = 'Create'
      context.icon = 'fa-user';
      context.description = "Please provide the initial values for the profile of user's that can log in and make changes to the system.";
      context.add = true;
      context.action = '/users/add';  
    } else {
      user = data || context.user;
      context.avatars = context.avatars.map((val, idx) => {
        return {
          value: val,
          name: utils.initialCap(val),
          checked: (user.avatar === val) ? 'checked' : ''
        }
      });
      context.title = (user == req.user) ? 'Edit Profile' : 'Update User';
      context.actiontitle = 'Save'
      context.icon = 'fa-save';
      context.description = "Make any changes you would like.";
      context.add = false;
      context.action = '/users/edit';
      context.username = utils.initialCap(user.username);
      context.fullname = user.fullname;
      context.jobtitle = user.jobtitle;
      context.userid = user.id;
    }
    return context;
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var ctx;
  if (req.user) {
    User.find((err, users) => {
      var msgs = []
      if (err) {
        msgs.push({class: 'box-danger', text: err.message});
        if (process.env['NODE_ENV'] === 'development') {
          msgs.push({ class: 'box-danger', text: err.stack });
        }
        req.flash('msgs', msgs);
        res.redirect('/');    
      } else {
        ctx = getContext('list', req, users);
        ctx.msgs = req.flash('msgs');
        res.render('users/list', ctx);
      }
    });
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    res.redirect('/');
  }
});

router.get('/add', function(req, res) {
  if (req.user) {
    res.render('users/edit', getContext('add', req));
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    res.redirect('/');
  }
});

router.post('/add', function(req, res) {
  var user = {
    username: req.body.username,
    fullname: req.body.fullname,
    jobtitle: req.body.jobtitle,
    avatar: req.body.avatar,
    password: req.body.password
  };

  if (req.user) {
    User.register( new User(user), user.password, (err, user) => {
      var ctx; 
      if (err) {
        ctx = getContext('add', req);
        ctx.msgs = [{ class: 'box-danger', text: err.message }];
        if (process.env['NODE_ENV'] === 'development') {
          ctx.msgs.push({ class: 'box-danger', text: err.stack });
        }
        return res.render('users/edit', ctx);
      }
      req.flash('msgs', [{class: 'box-success', text: `User ${user.username} successfully created and logged in!`}])
      res.redirect('/users');
    });
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    res.redirect('/');
  }
});

router.get('/edit', function(req, res) {
  if (req.user) {
    if (req.query.id) {
      User.findById(req.query.id, (err, user) => {
        var msgs = [];
        if (err) {
          msgs.push({ class: 'box-danger', text: err.message });
          if (process.env['NODE_ENV'] === 'development') {
            msgs.push({ class: 'box-danger', text: err.stack });
          }
          req.flash('msgs', msgs);
          res.redirect('/users');
        } else {
          res.render('users/edit', getContext('edit', req, user));
        }
      })
    } else {
      res.render('users/edit', getContext('edit', req));
    }
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    res.redirect('/');
  }
});

router.post('/edit', function(req, res) {
  var updates, ctx;
  if (req.user) {
    ctx = getContext('edit', req);
    if (req.body.userid === req.user.id) {
      req.user.fullname = req.body.fullname;
      req.user.jobtitle = req.body.jobtitle;
      req.user.avatar = req.body.avatar;
      req.user.save(function (err) {
        if (err) {
          ctx.msgs = [{ class: 'box-danger', text: err.message }];
          if (process.env['NODE_ENV'] === 'development') {
            ctx.msgs.push({ class: 'box-danger', text: err.stack });
          }
          res.render('users/edit', ctx);
        } else {
          req.flash('msgs', [{class: 'box-success', text: `User Profile successfully updated!`}])
          res.redirect('/');
        }
      });  
    } else {
        updates = {
          fullname: req.body.fullname,
          jobtitle: req.body.jobtitle,
          avatar: req.body.avatar
        };
        User.findByIdAndUpdate(req.body.userid, updates, { new: true }, (err, user) => {
        if (err) {
          ctx.msgs = [{ class: 'box-danger', text: err.message }];
          if (process.env['NODE_ENV'] === 'development') {
            ctx.msgs.push({ class: 'box-danger', text: err.stack });
          }
          res.render('users/edit', ctx);
        } else {
          req.flash('msgs', [{class: 'box-success', text: `User ${user.username} successfully updated!`}])
          res.redirect('/users');
        }
      });
    }
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in to create a user!'}])
    res.redirect('/');
  }
});

router.get('/remove', function(req, res) {
  if (req.user) {
    if (req.query.id) {
      User.findByIdAndDelete(req.query.id, (err, user) => {
        var msgs = [];
        if (err) {
          msgs.push({ class: 'box-danger', text: err.message });
          if (process.env['NODE_ENV'] === 'development') {
            msgs.push({ class: 'box-danger', text: err.stack });
          }
        } else {
          msgs.push({ class: 'box-success', text: `User ${user.username} has been deleted`})
        }
        req.flash('msgs', msgs);
        res.redirect('/users');
      });
    } else {
      req.flash('msgs', [{class: 'box-warning', text: 'Quit hacking my site!'}]);
      res.redirect('/');
    }
  } else {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    res.redirect('/');
  }
});

module.exports = router;
