// //Create User
// passport.use(User.createStrategy());

// //Serialize User
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// //Deserialize User
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// //Create Customer
// passport.use(Customer.createStrategy());

// //Serialize Customer
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// //Deserialize Customer
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });


// //LogIn route
// router.get('/login', (req, res) => {
//   res.render('login');
// });

// router.post('/login', (req, res) => {
// const username = req.body.username;
// const password = req.body.password;

// User.findOne({email: username}, (err, foundUser) => {
//   if (err) {
//       console.log(err);
//   }
//    else
//   {
//     if(foundUser)
//       bcrypt.compare(password, foundUser.password, function(err, result) {
//           if (result === true) {
//               res.redirect('/page');
//           } else {
//               res.redirect('/login');
//           }
          
//       });
      
//   }

//  })
// });


// //Register route
// router.get('/register', (req, res) => {
//   res.render('register');
// });

// router.post('/register', (req, res) => {

// //Hashes and salts new User password
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

// //creates new User
//       const newUser = new User({
//           email: req.body.username,
//           password: hash
//       });

// //Saves new User
//       newUser.save(
//           function (err) {
//               if (err) {
//                   console.log(err);
//               } else {
//                   res.render('user');
//               }
//           }
//       )
//   });
// });

// foundList.items.push(item);