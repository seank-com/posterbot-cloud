var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

var debug = require('debug')('db');

var User = require('../models/user');

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
    
  user.setPassword('letmein', function (err, result) {
    if (err) {
      debug('addAdmin - setPassword failed with ' + JSON.stringify(err));
      return callback(err);
    }
    user.save(function (err) {
      if (err) {
        debug('addAdmin - save failed with ' + JSON.stringify(err));
      }
      debug('addAdmin - calling callback');
      return callback(err);
    });
  });

}

function ensureAdmin(callback) {
  User.findOne({username: 'admin'}, (err, user) => {
    if (err) {
      debug('ensureAdmin - findOne failed with ' + JSON.stringify(err));
      return callback(err);
    }
    if (!user) {
      addAdmin(callback);
    } else {
      debug('ensureAdmin - found admin ' + JSON.stringify(user));
      return callback(null);
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
  
    ensureAdmin(callback);
  });
  
  tryConnect();
}

module.exports.close = function(callback) {
  mongoose.connection.close(() => {
    debug('close - connection closed');
    callback(null);
  });
}

