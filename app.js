// Dependencies
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const req = require('express/lib/request');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
//requires root
const authRoute = require('./routes/auth');
const bankStratRoute = require('./routes/bankingstrat');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Express session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));
  
// Passport initializer and session
app.use(passport.initialize());
app.use(passport.session());

// Database

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true});

//Routes
  app.use('/', authRoute);
  app.use('/', bankStratRoute);

//Port
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});