const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const OwnerRoutes = express.Router();

const Owner = require('../models/owner-model')

// multer for photo
const myUploader = multer({
  dest: __dirname + "/../public/uploads/owners"
});

// create new owner
OwnerRoutes.post('/api/owners/new', myUploader.single('phonePic'), (req, res, next) => {
    if(!req.user){
        res.status(401).json({message: "Log in to add owner."});
        return;
    }
    const newOwner = new Owner({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    });
    if(req.file){
        newOwner.image = '/uploads' + req.file.filename;
    }

    newOwner.save((err) => {
        if(err){
            res.status(500).json({message: "Some weird error from DB."});
            return;
        }
        // validation errors
        if (err && newOwner.errors){
            res.status(400).json({
                brandError: newOwner.errors.brand,
            });
            return;
        }
        req.user.encryptedPassword = undefined;
        newOwner.user = req.user;

        res.status(200).json(newOwner);
    });
});

// list the owners

OwnerRoutes.get('/api/owners', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to see owners." });
      return;
    }
    Owner.find()
      // retrieve all the info of the owners (needs "ref" in model)
      // don't retrieve "encryptedPassword" though
      .populate('user', { encryptedPassword: 0 })
      .exec((err, allTheOwners) => {
        if (err) {
          res.status(500).json({ message: "Owners find went bad." });
          return;
        }
        res.status(200).json(allTheOwners);
      });
});

// list single Owner
OwnerRoutes.get("/api/owners/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see THE owners." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findById(req.params.id, (err, theOwner) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "Properties find went bad." });
      return;
    }

    res.status(200).json(theOwner);
  });
});

// update the Owner
OwnerRoutes.put('/api/properties/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to update the Owner." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const updates = {
      name: req.body.name,
      floor_plan: req.body.floor_plan,
      comments: req.body.comments
    };

  Owner.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Owner updated successfully."
    });
  });
});

// delete Owner
OwnerRoutes.delete("/api/Owner/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the Owner." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  Owner.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Owner has been removed."
    });
  });
});


module.exports = OwnerRoutes;
