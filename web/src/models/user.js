var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  fullname: String,
  jobtitle: String,
  avatar: String
}, { 
  timestamps: true,
  collection: 'users'
});

User.plugin(passportLocalMongoose, { usernameLowerCase: true });

module.exports = mongoose.model('user', User);