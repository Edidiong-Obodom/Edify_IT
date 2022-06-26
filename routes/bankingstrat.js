//Dependencies
const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');
const theSeven = require('../utilities/theSeven');
const capNsmalz = require('../utilities/capNsmalz');
const date = require('../utilities/date');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Collections
const User = require('../models/User');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');



//router
const { Router } = require('express');

//Adds the first 3 numbers needed in creating the account number
const accTypeSavings = '102';
const accTypeCurrent = '202';

//APIs
  router.get('/', (req, res) => {
    res.render('home');
  });
  
  router.get('/about', (req, res) => {
    res.render('about');
  });

  router.get('/accounts/:smart', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    const smart = req.params.smart;

    try {
      // Customer.find({ path: smart }).populate('user');
        const profile = await Customer.findOne({ path: smart });
        if (!profile) {
          return res.render('register', {email: smart, exist: 'false'});
        } 
        else if (profile) {
          return res.render('accounts', {accounts: profile.accounts, email: smart});
                  
        }
       }catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
      }

    
  });

  router.get('/opensesame', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const cust = await Customer.find({});
    res.render('admin', {customers: cust});
  });

  router.get('/confirmpin/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    const user = await Customer.findOne({ path: smart });

    if (user) {
      
        res.render('confirmpin', {HolderName: user.firstname + ' ' + user.lastname, HolderAccNo: no, email: smart})
        
    
          
      }
    
  
  });

  router.get('/confirmpinw/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    const user = await Customer.findOne({ path: smart });

    if (user) {
      
        res.render('confirmpinw', {HolderName: user.firstname + ' ' + user.lastname, HolderAccNo: no, email: smart})
        
    
          
      }
    
  
  });

  router.post('/confirmpin/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    const user = await Customer.findOne({ path: smart });

    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(req.body.pin, user.password);
      if (validPassword) {
        res.redirect('/auth/pinreset/' + smart + '/' + no);

          
      } else {
        res.redirect('/confirmpinw/' + smart + '/' + no);
        
      }
    } else {
          
         res.redirect('/login');
      
    }
    
  
  });

  router.post('/confirm/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    const senderName = req.body.sendername;
    const receiver = req.body.receiver;
    const receiverName = req.body.receivername;
    const amount = req.body.amount;
    const user = await Customer.findOne({ path: smart });

    const accol = await user.accounts;
           
         const positron = await accol.map(function(e) {
            return e.accNo;
        }).indexOf(`${no}`);

    if (accol[positron].blocked === 'no') {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (validPassword) {
        const sendacco = user.accounts;

        const posi = sendacco.map(function(e) {
          return e.accNo;
          }).indexOf(`${no}`);

          if (sendacco[posi].accBal >= Number(amount)) {
            Customer.find({"accounts.accNo": receiver}, function (err, foundAcc) {

              if (err) {
                console.log(err);
              } else {
                foundAcc.forEach(accou => {
                  const acco = accou.accounts;
                   
                 const pos = acco.map(function(e) {
                    return e.accNo;
                }).indexOf(`${receiver}`);
        
                const sad = sendacco[posi].accBal - Number(amount);
                
                const happy = acco[pos].accBal + Number(amount);
                acco[pos].accBal = happy;
                accou.save();
        
                sendacco[posi].accBal = sad;
                user.save();

                Transaction.create({
                  senderName: sendacco[posi].accName,
                  senderAccNo: `${no}`,
                  amountSent: Number(amount),
                  receiverName: acco[pos].accName,
                  receiverAccNo: `${receiver}`,
                  username: `${theSeven.index14()}`,
                  status: 'Transaction Successful...'});
        
                res.render('approved', {HolderName: senderName, HolderAccNo: no, email: smart});
            
                });
              }
              
            });
          } else {
            Transaction.create({
              senderName: senderName,
              senderAccNo: `${no}`,
              amountSent: Number(amount),
              receiverName: receiverName,
              receiverAccNo: `${receiver}`,
              username: `${theSeven.index14()}`,
              status: 'Transaction Failed...'});

            res.render('declined', {HolderName: senderName, HolderAccNo: no, email: smart});
          }

          
      } else {
        res.render('wrongpin', {ReceiverAccNo: receiver, ReceiverName: receiverName, 
          HolderAccNo: no, HolderName: senderName, amount: amount, email: smart});
        
      }
    } else if (accol[positron].blocked === 'yes') {
      res.render('blocked', {HolderName: senderName, HolderAccNo: no, email: smart})

   } else {
          
         res.redirect('/login');
      
    }
    
  
  });
  

  router.get('/contact', (req, res) => {
    res.render('contact');
  });

  router.get('/customers/accounts/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const smart = req.params.smart;
    try {
      // Customer.find({ path: smart }).populate('user');
        const profile = await Customer.findOne({ path: smart });
        
          return res.render('adminviewacc', {accounts: profile.accounts, email: smart});
            
       }catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
      }

  });

  
  router.get('/dashboard/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    const smart = req.params.smart;
    const no = req.params.no;
    const accType = no.slice(0,3);
    typeAcc = function () {
      let usn = '';
       if (accType === accTypeSavings) {
        return usn = 'Savings';
      } else if (accType === accTypeCurrent) {
       return usn = 'Current';
      };
    };

      const cust = await Customer.findOne({path: smart});

      
          const acco = cust.accounts;
           
         const pos = acco.map(function(e) {
            return e.accNo;
        }).indexOf(`${no}`);

        
        
  return res.render('dashboard', {HolderAccNo: no, HolderName: cust.firstname + ' ' + cust.lastname, 
          HolderAccBal: Number(acco[pos].accBal).toLocaleString(), HolderAccType: `${typeAcc()}`, email: smart});

          
       
  });



  router.get('/details/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const smart = req.params.smart;
    const no = req.params.no;
    const accType = no.slice(0,3);
    typeAcc = function () {
      let usn = '';
       if (accType === accTypeSavings) {
        return usn = 'Savings';
      } else if (accType === accTypeCurrent) {
       return usn = 'Current';
      };
    };

      Customer.find({path: smart}, function (err, foundCustomers) {
        if (err) {
          console.log(err);
        } else {
          foundCustomers.forEach(cust => {
            const acco = cust.accounts;
             
           const pos = acco.map(function(e) {
              return e.accNo;
          }).indexOf(`${no}`);
  
          
          
    return res.render('details', {HolderAccNo: no, HolderName: cust.firstname + ' ' + cust.lastname,
       HolderAccType: `${typeAcc()}`, email: smart});
          });
        }
        
      });

      
          

          
       
  });

  router.post('/dashboard/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const smart = req.params.smart;
    const no = req.params.no;
    res.redirect('/dashboard/' + smart + '/' + no);
       
  });

  router.get('/edit/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {

    const no = req.params.no;
    const smart = req.params.smart;
    
    
    
        Customer.find({path: smart}, function (err, foundClients) {
          if (err) {
            console.log(err);
              }else{
                foundClients.forEach(client => {
                res.render('editprofile', 
    {HolderName: client.firstname + ' ' + client.lastname , HolderAccNo: no, email: smart});
    
              
               });
              }
            });
             
        
  });

  router.post('/edit/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {

    const no = req.params.no;
    const smart = req.params.smart;
    
    
    
    Customer.find({path: smart}, function (err, foundClients) {
      if (err) {
        console.log(err);
          }else{
            foundClients.forEach(client => {
              const acco = client.accounts;
                 
               const pos = acco.map(function(e) {
                  return e.accNo;
              }).indexOf(`${no}`);

              upDS = function () {
                //NOTE  only update fields that were actually passed...
              if (req.body.address !== '') {
                client.address = req.body.address;
              }
              if (req.body.dOB !== '') {
                client.dateOfBirth = req.body.dOB;
              }
              if (req.body.address !== '' || req.body.dOB !== '') {
                acco[pos].updatedOn = Date.now();
              }
          
              return client.save();
              }
               

               upDS();
                
               res.redirect('/profile/' + smart + '/' + no);
              

              

          
           });
          }
        });
             
        
  });

  router.get('/ehome/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const smart = req.params.smart;
    const user = await User.findOne({path: smart});
    if (user.favpet === 'nada') {
      res.redirect('/auth/securityque/' + smart);
    } else {
      res.render('emailhome', {email: smart, Email: user.username});
    }
    
       
  });
  router.get('/emailhome/:smart', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const smart = req.params.smart;
    const user = await User.findOne({path: smart});
    if (user.favpet === 'nada') {
      res.redirect('/auth/securityque/' + smart);
    } else {
      res.render('emailhome', {email: smart, Email: user.username});
    }
    
       
  });

  router.get('/emailabout/:smart', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const smart = req.params.smart;
    res.render('emailabout', {email: smart});
  });

  router.get('/emailcontact/:smart', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const smart = req.params.smart;
    res.render('emailcontact', {email: smart});
  });

  router.get('/immute/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    const smart = req.params.smart;
    const no = req.params.no;
    const cust = await Customer.findOne({path: smart});

    const accol = await cust.accounts;
           
         const positron = await accol.map(function(e) {
            return e.accNo;
        }).indexOf(`${no}`);

    if (accol[positron].blocked === 'no') {
      accol[positron].blocked = 'yes';
      cust.save();
      res.render('blockeds',  {HolderAccNo: no, email: smart});

    } else if (accol[positron].blocked === 'yes'){
      accol[positron].blocked = 'no';
      cust.save();
      res.render('unblockeds', {HolderAccNo: no, email: smart});
    }
    
  });

  router.get('/profile/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  
    const smart = req.params.smart;
    const no = req.params.no;


          Customer.find({"accounts.accNo": no}, function (err, foundAcc) {

            if (err) {
              console.log(err);
            } else {
              foundAcc.forEach(acc => {
                const acco = acc.accounts;
                 
               const pos = acco.map(function(e) {
                  return e.accNo;
              }).indexOf(`${no}`);
      
              
              
              res.render('profile', {HolderAccType: acco[pos].accType,HolderAccNo: no, HolderName: acco[pos].accName, HolderAdd: acc.address, HolderAge: date.getAge(acc.dateOfBirth), lUpd: acco[pos].updatedOn, email: smart});
              });
            }
            
          });
           
      
  
  
  });

  router.get('/transactionhis/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    try {
      // Customer.find({ path: smart }).populate('user');
        const sprofile = await Transaction.findOne({ senderAccNo: no });
        const rprofile = await Transaction.findOne({ receiverAccNo: no });
        const nultra = await Customer.findOne({ path: smart });
          if (!sprofile && !rprofile) {
            
            return res.render('transactionhisnul', {HolderAccNo: no, 
              HolderName: nultra.firstname + ' ' + nultra.lastname, email: smart});
            
          } 
          else if (sprofile || rprofile) {
            
                      Transaction.find({}, function (err, foundTransact) {
                        if (err) {
                           console.log(err);
                            }else{
                              return  res.render('transactionhis', {histories: foundTransact, HolderAccNo: no, 
                                HolderName: nultra.firstname + ' ' + nultra.lastname, email: smart});
                            }
                          });
              
          }
        
       }catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
         
      }  
  
  });

  router.get('/admin/transactionhis/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    try {
        const sprofile = await Transaction.findOne({ senderAccNo: no });
        const rprofile = await Transaction.findOne({ receiverAccNo: no });
        const nultra = await Customer.findOne({ path: smart });
          
            
                      Transaction.find({}, function (err, foundTransact) {
                        if (err) {
                           console.log(err);
                            }else{
                              return  res.render('admintranshis', {histories: foundTransact, HolderAccNo: no, 
                                HolderName: nultra.firstname + ' ' + nultra.lastname, email: smart});
                            }
                          });
              
       
        
       }catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
         
      }  
  
  });

  router.post('/admin/transactionhis/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    try {// Customer.find({ path: smart }).populate('user');
      const sprofile = await Transaction.findOne({ senderAccNo: no });
      const rprofile = await Transaction.findOne({ receiverAccNo: no });
      const nultra = await Customer.findOne({ path: smart });
        
          
                    Transaction.find({}, function (err, foundTransact) {
                      if (err) {
                         console.log(err);
                          }else{
                            return  res.render('admintranshis', {histories: foundTransact, HolderAccNo: no, 
                              HolderName: nultra.firstname + ' ' + nultra.lastname, email: smart});
                          }
                        });
            
     
        
       }catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
         
      }  
  
  });
  router.post('/adminreverse/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    const idd = req.body.id;
    const senderName = req.body.sender;
    const sender = req.body.senderaccno;
    const receiver = req.body.receiveraccno;
    const receiverName = req.body.receiver;
    const amount = req.body.amount;
    const user = await Customer.findOne({ path: smart });
    const tranc = await Transaction.findOne({ username: idd });

    if (tranc.status === 'Transaction Successful...') {
        
        const sendacco = user.accounts;

        const posi = sendacco.map(function(e) {
          return e.accNo;
          }).indexOf(`${no}`);

          
            Customer.find({"accounts.accNo": receiver}, function (err, foundAcc) {

              if (err) {
                console.log(err);
              } else {
                Transaction.deleteOne({ username: idd }, function (err) {
                  if (err) return handleError(err);
                  // deleted at most one tank document
                });
                foundAcc.forEach(accou => {
                  const acco = accou.accounts;
                   
                 const pos = acco.map(function(e) {
                    return e.accNo;
                }).indexOf(`${receiver}`);
        
                const sad = sendacco[posi].accBal + Number(amount);
                
                const happy = acco[pos].accBal - Number(amount);
                acco[pos].accBal = happy;
                accou.save();
        
                sendacco[posi].accBal = sad;
                user.save();

                
        
                res.render('reversesuccess', {HolderName: senderName, HolderAccNo: no, email: smart});
            
                });
              }
              
            });
          

      
    } else {
          
      res.render('reversefail', {HolderName: senderName, HolderAccNo: no, email: smart});
      
    }
    
  
  });

  // router.get('/transactionhisnul/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  //   const no = req.params.no;
  //   const smart = req.params.smart;

  //   const nultra = await Customer.findOne({ path: smart });
  //   res.render('transactionhisnul', {HolderAccNo: no, 
  //     HolderName: nultra.firstname + ' ' + nultra.lastname, email: smart});
    
  // });

  router.get('/transferval/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    
    
        Customer.find({path: smart}, function (err, foundClients) {
          if (err) {
            console.log(err);
              }else{
                foundClients.forEach(client => {
                res.render('transferval', 
    {HolderName: client.firstname + ' ' + client.lastname , HolderAccNo: no, email: smart});
    
              
               });
              }
            });
             
  
  });

  router.post('/transferval/:smart/:no', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const no = req.params.no;
    const smart = req.params.smart;
    const senderName = req.body.senderName;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    
    Customer.find({"accounts.accNo": receiver}, function (err, foundAcc) {

      if (err) {
        console.log(err);
      } else {
        foundAcc.forEach(acc => {
          const acco = acc.accounts;
           
         const pos = acco.map(function(e) {
            return e.accNo;
        }).indexOf(`${receiver}`);

        
        
        res.render('confirm', {ReceiverAccNo: receiver, ReceiverName: acco[pos].accName, 
          HolderAccNo: no, HolderName: senderName, amount: amount, email: smart});
        });
      }
      
    });
             
  
  });

  
router.get('/welcome/:smart/:no', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    const smart = req.params.smart;
    const no = req.params.no;
    const cust = await User.findOne({ path: smart });
    res.render('welcome', {email: smart, HolderAccNo: no, HolderName: cust.firstname + ' ' + cust.lastname});
       
  });

//Exports bankingstrat.js
module.exports = router;