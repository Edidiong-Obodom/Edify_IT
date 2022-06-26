const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

const transhisSchema = new mongoose.Schema({
    senderName: String,
    senderAccNo: String,
    amountSent: Number,
    receiverName: String,
    receiverAccNo: String,
    username: String,
    status: String,
    createdOn: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
 });

 transhisSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model('Transaction', transhisSchema);