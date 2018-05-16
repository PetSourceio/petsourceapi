'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.create = function(req, res) {
  console.log('POST users');
  console.log(req.body);
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    countryOfResidence: req.body.countryOfResidence,
    password: hashedPassword
  });
  newUser.save(function(err, user) {
    if (err){
      res.send(err);
      return;
    }

    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 1000*60*3 // expires in 3 minutes
    });

    res.status(200).send({auth: true, token: token, userId: user._id});
  });
  
};

exports.login = function(req, res) {
  console.log('POST users/login');
  console.log(req.body);
  User.findOne({ email : req.body.email }, function(err, user) {
    if (err){
      res.send(err);
      return;
    }    

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid){
      res.status(403).send({
        message: 'User password was incorrect.'
      });  
      return;
    }     

    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 1000*60*3 // expires in 3 minutes
    });

    res.status(200).send({auth: true, token: token, userId: user._id});
  });
  
};

exports.info = function(req, res) {
  console.log('GET users/info');
  res.status(200).json({email: "someName@email.com"});
};

exports.petList = function(req, res) {
  var id = req.params.userId;
  console.log('GET users/info');
  console.log('userId: ' + id);

  var token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).send({ auth: false, message: 'No token provided.' });
    return;  
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return;
    }
    
    res.status(200).json([{name: "pet1"}, {name: "pet2"}]);
  });
};

exports.wallet = function(req, res) {
  var id = req.params.userId;
  console.log('GET users/wallet');
  console.log('userId: ' + id);

  var token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).send({ auth: false, message: 'No token provided.' });
    return;
  } 

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return;
    } 
    
    res.status(200).json({ethAddress: "0x70775E3d54557738392469Aa032148995e08d190", ethBalance: 0.01312, ptsBalance: 1.32321});
  }); 
};