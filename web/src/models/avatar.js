var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Avatar = new Schema({
  name: { type: String, lowercase: true, unique: true },
  title: String,
  category: String,
  image : {
    data: Buffer,
    contentType: String
  }
}, { 
  timestamps: true,
  collection: 'avatars'
});

module.exports = mongoose.model('avatar', Avatar);