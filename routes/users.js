////////////////
//for ADMIN ONLY
////////////////
const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const userRoutes = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/user-model')

// multer for photo
const myUploader = multer({
  dest: __dirname + "/../public//uploads/users"
});



// create new user
userRoutes.post('/api/users/new', myUploader.single('phoneImage'), (req, res, next) => {
  console.log("REQ BODY:" ,req.body);
  if(!req.user){
      res.status(401).json({message: "Log in to create user."});
      return;
  }
  const newUser = new User({
    phone: req.body.phone,
    department: req.body.department,
    position: req.body.position,
    access: req.body.access,
    email: req.body.email.toLowerCase(),
    encryptedPassword: req.body.encryptedPassword,
    status: req.body.status,
    name: {first: req.body.name.first, last: req.body.name.last}
  });

  const salt = bcrypt.genSaltSync(10);
  const scrambledPassword = bcrypt.hashSync(req.body.encryptedPassword, salt);
  newUser.encryptedPassword = scrambledPassword;

  if(req.file){
      newUser.image = '/uploads/' + req.file.filename;
  }
  console.log("NEW USER:" ,newUser);
  newUser.save((err) => {
      if(err){
          res.status(500).json({message: "Some weird error from DB."});
          console.log(err);
          return;
      }
      // validation errors
      if (err && newUser.errors){
          res.status(400).json({
              brandError: newUser.errors.email,
          });
          console.log(err);
          return;
      }
      //req.user.encryptedPassword = undefined;
      //newPhone.user = req.user;

      res.status(200).json(newUser);
  });
});
// list the users
userRoutes.get('/api/users', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to see properties." });
      return;
    }
    User.find()
      // retrieve all the info of the owners (needs "ref" in model)
      // don't retrieve "encryptedPassword" though
      .populate('user', { encryptedPassword: 0 })
      .exec((err, allTheUsers) => {
        if (err) {
          res.status(500).json({ message: "Users find went bad." });
          return;
        }
        res.status(200).json(allTheUsers);
      });
});

// list single User
userRoutes.get("/api/users/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see the users." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(req.params.id, (err, theUser) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "User find went bad." });
      return;
    }
    theUser.encryptedPassword = "";
    res.status(200).json(theUser);
  });
});

// update the User
userRoutes.put('/api/users/:id', (req, res, next) => {
  console.log("User object is: ", req.body);
  if (!req.user) {
      res.status(401).json({ message: "Log in to update the user." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const updates = {
      phone: req.body.phone,
      department: req.body.department,
      position: req.body.position,
      access: req.body.access,
      email: req.body.email.toLowerCase(),
      encryptedPassword: '',
      status: req.body.status,
      name: {first: req.body.name.first, last: req.body.name.last}
    };
    
    if(req.body.encryptedPassword.length !== 0){ 
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.encryptedPassword, salt);
      updates.encryptedPassword = scrambledPassword;
    } else { //if user doesnt supply a new password, then keep the old one
      delete updates.encryptedPassword; 
    }

  User.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "User updated successfully."
    });
  });
});

// delete User
userRoutes.delete("/api/user/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the user." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  User.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "User has been removed."
    });
  });
});


module.exports = userRoutes;
