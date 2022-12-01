//Dependencies
const router = require("express").Router();
//Collections
const User = require("../models/User");
//router
const { Router } = require("express");



//APIs
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/contact", (req, res) => {
  res.render("contact");
});
router.get("/opensesame", (req, res) => {
  User.find({}, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      return res.render("messages", {
        messages: foundUser
      });
    }
  });
});

router.get("/portfolio", (req, res) => {
  res.render("portfolio");
});

router.get("/services", (req, res) => {
  res.render("services");
});

router.post("/message", async (req, res) => {
  try {
    const nameb = req.body.name;
    const emailb = req.body.email;
    const messageb = req.body.msg;

    const user = new User({
      name: nameb,
      email: emailb,
      message: messageb
    });

    await user.save();
    res.redirect("/");
  } catch (error) {
    
  }
})

//Exports bankingstrat.js
module.exports = router;
