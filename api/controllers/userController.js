'use strict';
var bcrypt = require('bcryptjs');
var config = require('../config');
var ethereum = require('../services/ethereum');
var authentication = require('../services/authentication');

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Wallet = mongoose.model('Wallet'),
  ObjectId = mongoose.Types.ObjectId;


exports.create = function(req, res) {
  console.log('POST users');
  console.log(req.body);

  var token = req.headers['x-access-token'];
  authentication.validateToken(req.body.authPlatform, req.body.email, token, {}, function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
      return;
    }

    User.findOne({ email : req.body.email }, function(err, user) {
      if (user) {
        res.status(409).send({ auth: false, message: "User already exists" });
        return;
      }

      var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        countryOfResidence: req.body.countryOfResidence,
        authPlatform: req.body.authPlatform
      });
      newUser.save(function(err, user) {
        if (err){
          res.send(err);
          return;
        }
        res.status(200).send({userId: user._id});
      });
    });
  });
};

exports.exists = function(req, res) {
  var email = req.query.email;
  console.log('GET users exits');
  if (!email) {
    res.status(401).send("Please provide email as query parameter");
  }

  var token = req.headers['x-access-token'];

  User.findOne({ email : email }, function(err, user) {
    if (err){
      res.send(err);
      return;
    }

    if (!user) {
      return res.status(404);
    } else {
      console.log(user);
      authentication.validateToken(user.authPlatform, email, token, {}, function(err, data) {
        if (err) {
          res.status(200).send({ message: "User exits, but token auth failed! cause: " + err.msg});
          return;
        }
        return res.status(200);
      });
    }
  });
};

exports.info = function(req, res) {
  var userId = req.params.userId;
  console.log('GET users/:userId');
  console.log('userId: ' + userId);

  var token = req.headers['x-access-token'];

  User.findOne({ _id : new ObjectId(userId) }, function(err, user) {
    if (err){
      res.send(err);
      return;
    }

    authentication.validateUserLogin(user, token, {}, function(err, data) {
      if (err) {
        res.status(err.status).send({ auth: false, message: err.msg });
        return;
      }

      console.log('user found, returning');
      console.log(user);
      res.status(200).json(user.toJSON());
    });
  });
};

exports.petList = function(req, res) {
  var id = req.params.userId;
  console.log('GET users/:userId/pets');
  console.log('userId: ' + id);

  authentication.validateLogin(id, req.headers['x-access-token'], {}, function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
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

  authentication.validateLogin(id, req.headers['x-access-token'], {}, function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
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

  authentication.validateLogin(id, req.headers['x-access-token'], {}, function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
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
