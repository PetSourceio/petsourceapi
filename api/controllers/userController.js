'use strict';

var mongoose = require('mongoose'),
  UserModel = mongoose.model('User');

exports.create = function(req, res) {
  console.log('POST users');
  console.log(req.body);
  var newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    countryOfResidence: req.body.countryOfResidence,
    password: req.body.password
  });
  newUser.save(function(err, createdUser) {
    if (err)
      res.send(err);
      res.status(200).json(createdUser._id);
  });
  
};

exports.login = function(req, res) {
  console.log('POST users/login');
  console.log(req.body);
  res.status(200).json(1);
};

exports.info = function(req, res) {
  console.log('GET users/info');
  res.status(200).json({email: "someName@email.com"});
};

exports.petList = function(req, res) {
  var id = req.params.id;
  console.log('GET users/info');
  console.log('userId: ' + id);
  res.status(200).json([{name: "pet1"}, {name: "pet2"}]);
};

exports.wallet = function(req, res) {
  var id = req.params.id;
  console.log('GET users/wallet');
  console.log('userId: ' + id);
  res.status(200).json({ethAddress: "0x70775E3d54557738392469Aa032148995e08d190", ethBalance: 0.01312, ptsBalance: 1.32321});
};