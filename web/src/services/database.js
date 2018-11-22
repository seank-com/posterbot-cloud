var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

var debug = require('debug')('db');

var utils = require('../utils/utils');
var User = require('../models/user');
var Avatar = require('../models/avatar');

const server = 'mongo:27017';
const database = 'posterbot';

var retries = 30;
var timeout = 5000;
var initialized = 0;
var options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  connectTimeoutMS: 30000, // How long the MongoDB driver 
  // will wait before failing its initial connection attempt. 
};

function addAdmin(callback) {
  var user = new User({
      username: 'admin',
      fullname: 'Administrator',
      jobtitle: 'Digital Slave',
      avatar: 'robot'
    });
    
  user.setPassword('letmein', (err, result) => {
    if (err) {
      debug('addAdmin - setPassword failed with ' + JSON.stringify(err));
      return callback(err);
    }
    user.save((err) => {
      if (err) {
        debug('addAdmin - save failed with ' + JSON.stringify(err));
      }
      debug('addAdmin - calling callback');
      return callback(err);
    });
  });
}

function ensureAdmin(callback) {
  User.countDocuments((err, count) => {
    if (err) {
      debug('ensureAdmin - countDocuments failed with ' + JSON.stringify(err));
      return callback(err);
    } else if (!count) {
      addAdmin(callback);
    } else {
      debug('ensureAdmin - found ' + count + ' user accounts');
      return callback(null);
    }
  });
}

function ensureAvatar(file, callback) {
  var p = path.parse(file),
    filename = p.name.toLowerCase().split("-"),
    name = filename[1],
    category = filename[0],
    ext = p.ext.toLowerCase();
  if (ext === '.png') {
    Avatar.findOne({name: name}, (err, avatar) => {
      if (err) {
        return callback(err);
      } else {
        if (!avatar) {
          avatar = new Avatar();
          avatar.name = name;
          avatar.category = category;
          avatar.title = utils.initialCap(name);
          avatar.image.data = fs.readFileSync(file);
          avatar.image.contentType = 'image/png';
          avatar.save((err, avatar) => {
            callback(err);
          });
        } else {
          return callback(null);
        }
      }
    });  
  } else {
    process.nextTick(() => {
      callback(null);
    })
  }
}

function ensureAvatars(callback) {
  var dir = path.join(__dirname, '../public/img');
  fs.readdir(dir, (err, files) => {
    var count;
    if (err) {
      return callback(err);
    } else {
      count = files.length;
      files.forEach((file) => {
        var filepath = path.join(dir, file)
        ensureAvatar(filepath, (err) => {
          if (count) {
            if (err) {
              // shortcircuit processing
              count = 1;            
            }
            count -= 1;
            if (!count) {
              return callback(err);
            }
          }
        });
      });
    }
  });
}

module.exports.init = function(callback) {
  var tryConnect = function() {
    mongoose.connect(`mongodb://${server}/${database}`, options, (err) => {
      if (err) {
        debug('tryConnect - initial connect failed (' + retries + 'retries every ' + timeout + 'ms) '+ JSON.stringify(err));

        if (retries) {
          retries -= 1;
          setTimeout(tryConnect, timeout);
        } else {
          callback(err);
        }
      } else {
        debug('tryConnect - connected successfully')
      }
    });    
  };

  // only on first connect lets wire up all the event handlers.
  // https://theholmesoffice.com/mongoose-connection-best-practice/
  mongoose.connection.once('open', () => {
    debug('event open');
  
    mongoose.connection.on('connected', () => {
      debug('event connected');
    });
  
    mongoose.connection.on('disconnected', () => {
      debug('event disconnected');
    });
  
    mongoose.connection.on('reconnected', () => {
      debug('event reconnected');
    });
  
    mongoose.connection.on('error', (err) => {
      debug('event error ' + JSON.stringify(err));
    });
  
    ensureAdmin(function (err) {
      if (err) {
        callback(err);
      } else {
        ensureAvatars(callback);
      }
    });
  });
  
  tryConnect();
}

module.exports.close = function(callback) {
  mongoose.connection.close(() => {
    debug('close - connection closed');
    callback(null);
  });
}
