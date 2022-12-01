// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const req = require('express/lib/request');
const mongoose = require('mongoose');
//requires root
const api = require('./routes/api');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// Database
// 'mongodb://localhost:27017/edifyit' 
mongoose.connect('mongodb://localhost:27017/edifyit', { useNewUrlParser: true});

//Routes
  app.use('/', api);

//Port
app.listen(3000, () => {
  console.log("Server Running on port 3000");
});