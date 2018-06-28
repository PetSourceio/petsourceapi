'use strict';

var bcrypt = require('bcryptjs');
var config = require('../config');
var ethereum = require('../services/ethereum');
var authentication = require('../services/authentication');

var mongoose = require('mongoose'),
  Wallet = mongoose.model('Wallet'),
  ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
    console.log('POST pets');

    authentication.validateLogin(req.body.userID, req.headers['x-access-token'], {}, function(err, data) {
      if (err) {
        res.status(err.status).json({ auth: false, message: err.msg });
        return;
      }
      console.log('Getting wallet for ' + req.body.userID);
      Wallet.findOne({ userId : req.body.userID }, async function(err, walletInfo) {
        if (err){
          res.status(500).json(err);
          return;
        }
        if (walletInfo) {
          if (!req.body.guid) {
            res.status(400).json({msg: 'guid not proivded!'});
            return;
          }

          var tx = await ethereum.storePet(req.body, walletInfo.address);
          res.status(200).json(tx);
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

exports.creationStatus = async (req, res) => {
  console.log('GET pets/:txId/status');
  console.log(req.params.txId);

  if (!req.query.userId) {
    res.status(400).json({ auth: false, message: "Please provide user id as query param userId" });
    return;
  }

  authentication.validateLogin(req.query.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var status = await ethereum.transactionStatus(req.params.txId);
    console.log('Tx' + req.params.txId + ' status ' + status)
    res.status(200).json(status);
  });
};

exports.info = async (req, res) => {
  var id = req.params.petId;
  console.log('GET pets/:petId');
  console.log('petId: ' + id);

  if (!req.query.userId) {
    res.status(400).json({ auth: false, message: "Please provide user id as query param userId" });
    return;
  }

  authentication.validateLogin(req.query.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var info = await ethereum.pet(id);
    res.status(200).json(info);
  });
};

exports.search = async (req, res) => {
  console.log('POST pets/search/chip/:chipId');
  console.log(req.body);

  authentication.validateLogin(req.body.userID, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var chipId = req.body.chipId;
    var breed = req.body.breed;
    var type = req.body.type;
    var country = req.body.country;

    var result = [];
    var petCount = await ethereum.petCount();
    console.log('Found pet count: ' + petCount);
    for (var i = 0; i < petCount; i++) {
      var pet = await ethereum.petByNo(i);
      if ((!chipId || pet.chipNumber == chipId) &&
          (!breed || pet.breed == breed)) {
        result.push(pet);
      }
    }
    res.status(200).json(result);
  });
};
