const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

const customerSchema = new mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    username: String,
    path: String,
    accounts: [{
        indi: Number,
        blocked: String,
        accName: String,
        accNo: String,
        accType: String,
        accBal: {
            type: Number,
            default: 5000,
            immutable: false
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
    }],
    phoneNumber: String,
    dateOfBirth: String,
    age: String,
    sex: String,
    address: String,
    password: String,
    email: String,
    createdOn: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
  });

  customerSchema.plugin(passportLocalMongoose);

  customerSchema.statics.findByAccNo = function (username) {
      return this.find ({username: new RegExp(username, '1')});
  };
  customerSchema.query.byAccNo = function (username) {
      return this.where ({username: new RegExp(username, '1')});
  };
  
  customerSchema.pre('save', function (next) {
      this.updatedOn = Date.now()
      next();
  })

module.exports  = mongoose.model('Customer', customerSchema );