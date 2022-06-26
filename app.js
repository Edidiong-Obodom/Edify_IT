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
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  app.listen(port, function() {
      console.log(`Server started on port ${port}`);
    });