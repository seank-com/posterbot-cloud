var express = require('express');
var utils = require('../utils/utils');
//var User = require('../models/user');
//var Avatar = require('../models/avatar');

var router = express.Router();

function loadContext(req, res, next) {
  // all user path require login
  if (!req.user) {
    req.flash('msgs', [{class: 'box-warning', text: 'You must be logged in!'}]);
    return res.redirect('/');
  } 

  if (req.path === '/') {
    /*
    User.find((err, users) => {
      if (err) {
        req.flash('msgs', utils.getErrMsgs(err));
        return res.redirect('/');
      }
      res.locals.users = users
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
      next();
    });*/
    res.locals.themes = [];
    next();
  } else {
    /*
    Avatar.find({}, 'name title category', (err, avatars) => {
      if (err) {
        req.flash('msgs', utils.getErrMsgs(err));
        return res.redirect('/');
      }

      res.locals.avatars = avatars.map((avatar) => {
        return {
          value: avatar.name,
          name: avatar.title,
          category: avatar.category
        };
      }).sort((a,b) => {
        var nameA = a.category.toUpperCase();
        var nameB = b.category.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
    */
      if (req.path === '/add') {
        /*
        selected = Math.floor(Math.random() * res.locals.avatars.length);
        res.locals.avatars.forEach((avatar, idx) => {
          avatar.checked = (selected === idx) ? 'checked' : '';
        });
        */
        res.locals.tags = [
          { id: "50341373e894ad16347efe01", title: "Sample Poster 1" },
          { id: "50341373e894ad16347efe02", title: "Sample Poster 2" },
          { id: "50341373e894ad16347efe03", title: "Sample Poster 3" },
          { id: "50341373e894ad16347efe04", title: "Sample Poster 4" },
          { id: "50341373e894ad16347efe05", title: "Sample Poster 5" },
          { id: "50341373e894ad16347efe06", title: "Sample Poster 6" },
          { id: "50341373e894ad16347efe07", title: "Sample Poster 7" },
          { id: "50341373e894ad16347efe08", title: "Sample Poster 8" },
          { id: "50341373e894ad16347efe09", title: "Sample Poster 9" },
          { id: "50341373e894ad16347efe10", title: "Sample Poster 10" },
          { id: "50341373e894ad16347efe11", title: "Sample Poster 11" },
          { id: "50341373e894ad16347efe12", title: "Sample Poster 12" },
          { id: "50341373e894ad16347efe13", title: "Sample Poster 13" },
          { id: "50341373e894ad16347efe14", title: "Sample Poster 14" },
          { id: "50341373e894ad16347efe15", title: "Sample Poster 15" }
        ];
        res.locals.title = 'Add Themes';
        res.locals.actiontitle = 'Create'
        res.locals.icon = 'fa-plus';
        res.locals.description = "Please provide the initial values for this theme of posters.";
        res.locals.add = true;
        res.locals.action = '/themes/add';  
        next();
      } else {
        /*
        function loadUser(user) {
          res.locals.avatars.forEach((avatar) => {
            avatar.checked = (user.avatar === avatar.name) ? 'checked' : '';
          });
          */
          res.locals.title = 'Update Theme';
          res.locals.actiontitle = 'Save'
          res.locals.icon = 'fa-save';
          res.locals.description = "Make any changes you would like.";
          res.locals.add = false;
          res.locals.action = '/themes/edit';
          res.locals.themeid = 'foo';
          next();
          /*
        }

        if (req.query.id) {
          User.findById(req.query.id, (err, user) => {
            if (err) {
              req.flash('msgs', utils.getErrMsgs(err));
              return res.redirect('/');      
            }
            loadUser(user);
          })
        } else {
          loadUser(res.locals.user);
        }
        */
      }
      /*
    });
    */
  }
}

router.get('/', loadContext, function(req, res, next) {
  res.render('themes/list', {});  
});

router.get('/add', loadContext, function(req, res) {
  res.render('themes/add-edit', {});
});


router.post('/add', loadContext, function(req, res) {
  var poster = {
    title: req.body.username,
    description: req.body.fullname,
    tags: req.body.jobtitle,
    posters: req.body.posters
  };
  /*
  User.register( new User(user), user.password, (err, user) => {
    if (err) {
        res.locals.concat(utils.getErrMsgs(err));
        res.render('users/add-edit', {});
    } else {
      req.flash('msgs', [{class: 'box-success', text: `User ${user.username} successfully created and logged in!`}])
      res.redirect('/users');
    }
  });
  */
});

router.get('/edit', loadContext, function(req, res) {
  res.render('themes/add-edit', {});
});
/*
router.post('/edit', loadContext, function(req, res) {
  var updates;

  if (req.body.userid === req.user.id) {
    req.user.fullname = req.body.fullname;
    req.user.jobtitle = req.body.jobtitle;
    req.user.avatar = req.body.avatar;
    req.user.save(function (err) {
      if (err) {
        res.locals.msgs.concat(utils.getErrMsgs(err));
        res.render('users/add-edit', {});
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
        res.locals.msgs.concat(utils.getErrMsgs(err));
        res.render('users/add-edit', {});
      } else {
        req.flash('msgs', [{class: 'box-success', text: `User ${user.username} successfully updated!`}])
        res.redirect('/users');
      }
    });
  }
});

router.get('/remove', function(req, res) {
  if (req.user) {
    if (req.query.id) {
      User.findByIdAndDelete(req.query.id, (err, user) => {
        if (err) {
          req.flash('msgs', utils.getErrMsgs(err));
          return res.redirect('/users');
        }
        req.flash('msgs', { class: 'box-success', text: `User ${user.username} has been deleted`});
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

router.get('/avatar/:name', function(req, res) {
  if (req.user) {
    Avatar.findOne({name: req.params['name']}, (err, avatar) => {
      if (err) {
        return res.status(500).send(JSON.stringify(err));
      } 
      if (!avatar) {
        return res.status(404).send('Avatar not found!');
      }
      res.contentType(avatar.image.contentType);
      res.send(avatar.image.data);
    });
  } else {
    res.status(403).send('You must be logged in!');
  }
});
*/

module.exports = router;
