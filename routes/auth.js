//Dependencies
const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');
const theSeven = require('../utilities/theSeven');
const capNsmalz = require('../utilities/capNsmalz');
const date = require('../utilities/date');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//User Collections
const User = require('../models/User');
//Create User
passport.use(User.createStrategy());

//Serialize User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserialize User
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//Customer Collection
const Customer = require('../models/Customer');

//router
const { Router } = require('express');

//Adds the first 3 numbers needed in creating the account number
  const accTypeSavings = '102';
  const accTypeCurrent = '202';

//APIs

//LogIn Route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
      const emai = req.body.username;
      const smart = capNsmalz.smooth(emai);
      res.redirect('/ehome/' + smart);
    
  });

//LogOut User
  router.get('/auth/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });

  });

//Register route
router.get('/register/:smart', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
  const smart = req.params.smart;
  try {
    // Customer.find({ path: smart }).populate('user');
      const profile = await Customer.findOne({ path: smart });
      if (!profile) {
        return res.render('register', {email: smart, exist: 'false'});
      } 
      else if (profile) {
        return res.render('register', {email: smart, exist: 'true', fname: profile.firstname, lname: profile.lastname});
      }
     }catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
});

router.post('/registernew/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
        const smart = req.params.smart;
        const fiName = req.body.firstname;
        const mName = req.body.middlename;
        const laName = req.body.lastname;
        const accType = req.body.accountType;
        
       typeAcc = function () {
          let usn = '';
           if (accType === 'Savings') {
            return usn = accTypeSavings;
          } else if (accType === 'Current') {
           return usn =accTypeCurrent
          };
        };

        const accno = `${typeAcc()}${theSeven.index()}`;

        const user = await User.findOne({path: smart});

    //Hashes and salts new User password
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

       
                 const newCustomer = new Customer({
                    firstname: user.firstname,
                    middlename: user.middlename,
                    lastname: user.lastname,
                    username: user.username,
                    path: smart,
                    accounts: [{
                      indi: 1,
                        blocked: 'no',
                        accName: user.firstname + ' ' + user.lastname,
                        accNo: `${typeAcc()}${theSeven.index()}`,
                        accType: req.body.accountType
                    }],
                    phoneNumber: req.body.phoneNo,
                    dateOfBirth: req.body.dOB,
                    age: req.body.age,
                    sex: req.body.sex,
                    address: req.body.address,
                    password: hash
                  }); 
                  
                  newCustomer.save();
                  return res.redirect('/welcome/' + smart + '/' + accno);
 
             
           
        });    
 });
router.post('/registerold/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
        const smart = req.params.smart;
        const fiName = req.body.firstname;
        const mName = req.body.middlename;
        const laName = req.body.lastname;
        const accType = req.body.accountType;
        
       typeAcc = function () {
          let usn = '';
           if (accType === 'Savings') {
            return usn = accTypeSavings;
          } else if (accType === 'Current') {
           return usn =accTypeCurrent
          };
        };

        const accno = `${typeAcc()}${theSeven.index()}`;

        const user = await Customer.findOne({path: smart});

                 
        user.accounts.push(
                    {indi: user.accounts.length + 1,
                    blocked: 'no',
                    accName: user.firstname + ' ' + user.lastname,
                    accNo: accno,
                    accType: req.body.accountType}
                  );

                  user.save();

                  return res.redirect('/details/' + smart + '/' + accno);

            });
    
   
  

// Register new account route
router.get('/auth/register', (req, res) => {
  res.render('emailreg');
});
router.get('/auth/registerex', (req, res) => {
  res.render('emailregex');
});

router.post('/auth/register', async (req, res) => {
  const fName = req.body.fName;
  const mName = req.body.mName;
  const lName = req.body.lName;
  const user = await User.findOne({username: req.body.username});
  
  if (user) {
    res.render('emailregex');
  } else {
    User.register({username: req.body.username, firstname: capNsmalz.neat(fName),
      middlename: capNsmalz.neat(mName), lastname: capNsmalz.neat(lName),
      path: capNsmalz.smooth(req.body.username), favpet: 'nada', favfood: 'nada', maidname: 'nada'}, req.body.password, function (err, user) {
      if (err) {
          res.redirect('/auth/registerex');
      } else {
          passport.authenticate('local')(req, res, function () {
            // Customer.create({email: req.body.username});
  
              res.redirect('/auth/securityque/' + capNsmalz.smooth(req.body.username));
          });
      }
     });
  }
    
});

router.get('/auth/securityquecheck/:smart',  connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const smart = req.params.smart;


          res.render('securityquecheck', {email: smart});
});

router.get('/auth/securityquechecknot', (req, res) => {
  const smart = req.params.smart;


          res.render('securityquechecknot');
});

router.get('/auth/securityque/:smart', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const smart = req.params.smart;


          res.render('securityque', {email: smart});
});

router.post('/auth/securityque/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const smart = req.params.smart;
  const favPet = req.body.favpet;
  const favFood = req.body.favfood;
  const maidName = req.body.maidname;
  const user = await User.findOne({ path: smart });
    
    if (user) {
      bcrypt.hash(capNsmalz.neat(favPet), saltRounds, function(err, hashPet) {
      bcrypt.hash(capNsmalz.neat(favFood), saltRounds, function(err, hashFood) {
      bcrypt.hash(capNsmalz.neat(maidName), saltRounds, function(err, hashMaid) {
      user.favpet = hashPet;
      user.favfood = hashFood;
      user.maidname = hashMaid;

      user.save();
      res.redirect('/emailhome/' + smart);
      });
      });
      });
    }


         
});

router.post('/auth/securityquecheck/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const favPet = req.body.favpet;
  const favFood = req.body.favfood;
  const maidName = req.body.maidname;
  const smart = req.params.smart;
  const user = await User.findOne({ path: smart });
  const favpet = await bcrypt.compare(capNsmalz.neat(favPet), user.favpet);
  const favfood = await bcrypt.compare(capNsmalz.neat(favFood), user.favfood);
  const maidname = await bcrypt.compare(capNsmalz.neat(maidName), user.maidname);

  if (favpet && favfood && maidname){
    res.render('passwordreset', {email: smart});
  } else {
    res.render('securityquecheckw', {email: smart});
  }
    
});

router.post('/auth/securityquechecknot', async (req, res) => {
  const smart = capNsmalz.smooth(req.body.username);
  const favPet = req.body.favpet;
  const favFood = req.body.favfood;
  const maidName = req.body.maidname;
  const user = await User.findOne({ path: smart });
  const favpet = await bcrypt.compare(capNsmalz.neat(favPet), user.favpet);
  const favfood = await bcrypt.compare(capNsmalz.neat(favFood), user.favfood);
  const maidname = await bcrypt.compare(capNsmalz.neat(maidName), user.maidname);

  if (favpet && favfood && maidname){
    res.render('passwordreset', {email: smart});
  } else {
    res.render('securityquecheckwnot');
  }
    
});

  //reset password

  router.post('/auth/passwordreset/:smart', (req, res) => {
    const smart = req.params.smart;

    User.findOne({ path: smart }, function (err, user) {
      user.setPassword( req.body.pin, function(err, users) { 
        User.updateOne({ _id: users._id },{ hash: users.hash, salt: users.salt },
    (err,result) => {
          if (err) {
           res.send(err);
          } else {
            res.redirect('/login');
    
          }
        })
      }) 
    })
  });

  router.get('/auth/pinreset/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
  
 
     Customer.find({path: smart}, function (err, foundClients) {
      if (err) {
        console.log(err);
          }else{
            foundClients.forEach(client => {
            res.render('pinreset', 
{HolderName: client.firstname + ' ' + client.lastname, HolderAccNo: no, email: smart});

          
           });
          }
        });
      
  

  });
  router.get('/auth/pinreset/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;

     Customer.find({path: smart}, function (err, foundClients) {
      if (err) {
        console.log(err);
          }else{
            foundClients.forEach(client => {
            res.render('pinreset', 
{HolderName: client.firstname + ' ' + client.lastname, HolderAccNo: no, email: smart});

          
           });
          }
        });


  });

  router.post('/auth/pinreset/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const smart = req.params.smart;

    //Hashes and salts new User password
    bcrypt.hash(req.body.pin, saltRounds, function(err, hash) {

      Customer.find({ path: smart }, function (err, user) {

        user.forEach(us => {
          us.password = hash;
          us.save();
          res.redirect('/login');
        });


      });

    });
  });



//Exports auth.js
module.exports = router;