const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    middlename: String,
    lastname: String,
    password: String,
    path: String,
    favpet: String,
    favfood: String,
    maidname: String,
    customer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Customer"
    },
    updatedOn: {
        type: Date,
        default: () => Date.now()
    },
    createdOn: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }

  });

  userSchema.plugin(passportLocalMongoose);

  userSchema.statics.findByAccNo = function (username) {
      return this.find ({username: new RegExp(username, '1')});
  };
  userSchema.query.byAccNo = function (username) {
      return this.where ({username: new RegExp(username, '1')});
  };
  
  userSchema.pre('save', function (next) {
      this.updatedOn = Date.now()
      next();
  })

module.exports  = mongoose.model('User', userSchema);