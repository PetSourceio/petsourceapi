'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var ethereum = require('../services/ethereum');


var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Wallet = mongoose.model('Wallet'),
  ObjectId = mongoose.Types.ObjectId;

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
  var userId = req.params.userId;
  console.log('GET users/:userId');
  console.log('userId: ' + userId);

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

    User.findOne({ _id : new ObjectId(userId) }, function(err, user) {
      if (err){
        res.send(err);
        return;
      }

      if (user){
        console.log('user found, returning');
        console.log(user);
        res.status(200).json(user.toJSON());
        return;
      }
      else {
        console.log('User not found');
        res.status(404);
        return;
      }
    });
  });
};

exports.petList = function(req, res) {
  var id = req.params.userId;
  console.log('GET users/:userId/pets');
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

    Wallet.findOne({ userId : id }, async function(err, walletInfo) {
      if (err){
        res.send(err);
        return;
      }
      if (walletInfo){
        var pets = await ethereum.listPets(walletInfo.address);
        res.status(200).json(pets);
        return;
      }
      else {
        console.log('Wallet not found');
        res.status(404).send();
        return;
      }
    });
  });
};

exports.wallet = async function(req, res) {
  var id = req.params.userId;
  console.log('GET users/:userId/wallet');
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
    console.log('Getting wallet for ' + id);
    Wallet.findOne({ userId : id }, async function(err, walletInfo) {
      if (err){
        res.send(err);
        return;
      }
      if (walletInfo){
        var balance = await ethereum.getEthBalance(walletInfo.address);
        res.status(200).json({ethAddress: walletInfo.address, ethBalance: balance, ptsBalance: 0});
        return;
      }
      else {
        console.log('Wallet not found');
        res.status(404).send();
        return;
      }
    });

  });
};

exports.newWallet = function(req, res) {
  var id = req.params.userId;
  console.log('POST users/:userId/wallet');
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

    var walletString = ethereum.createWallet(req.body.email, req.body.password);
    var address = ethereum.getWalletAddress(walletString, req.body.password);

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var newWallet = new Wallet({
      userId: id,
      walletString: walletString,
      address: address,
      email: req.body.email,
      password: hashedPassword
    });
    newWallet.save(function(err, user) {
      if (err){
        res.send(err);
        return;
      }

      res.status(200).send(address);
    });
  });
};
