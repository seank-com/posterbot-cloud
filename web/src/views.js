var hbs = require('hbs');
var path = require('path');

function init(app) {
  var blocks = {};

  // set the view engine to use handlebars
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, "views"));

  hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
  });

  hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
  });

  // make sure everything templates expect res.locals is there
  app.use((req, res, next) => {
    // add any flash messages from other pages
    res.locals.msgs = req.flash('msgs') || [];
  
    // If a user is logged in then add him to the context
    if (req.user) {
      res.locals.user = {
        avatar: req.user.avatar,
        fullname: req.user.fullname,
        jobtitle: req.user.jobtitle,
        startmonth: req.user.createdAt.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      };
    }
  
    res.locals.navlinks = [];
    [
      {ref: '/', icon: 'fa-home', title: 'Dashboard', description: 'This is where everything begins.'},
      {ref: '/posters', icon: 'fa-photo', title: 'Posters', description: 'Where all the creative work happens.'},
      {ref: '/themes', icon: 'fa-folder', title: 'Themes', description: 'The categories to group posters under.'},
      {ref: '/users', icon: 'fa-users', title: 'Users', description: 'The people that can log in and make changes to the system.'}
    ].forEach((link) => {
      if (link.ref === req.url) {
        link.active = 'active';
        res.locals.title = link.title;
        res.locals.description = link.description;
        if (link.ref !== '/') {
          res.locals.location = link.title;
        }
      }
      res.locals.navlinks.push(link);
    });
  
    next();
  });  
}

module.exports.init = init;