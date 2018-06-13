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
        res.status(err.status).send({ auth: false, message: err.msg });
        return;
      }
      console.log('Getting wallet for ' + req.body.userID);
      Wallet.findOne({ userId : req.body.userID }, async function(err, walletInfo) {
        if (err){
          res.send(err);
          return;
        }
        if (walletInfo) {
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
    res.status(400).send({ auth: false, message: "Please provide user id as query param userId" });
    return;
  }

  authentication.validateLogin(req.query.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
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
    res.status(400).send({ auth: false, message: "Please provide user id as query param userId" });
    return;
  }

  authentication.validateLogin(req.query.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).send({ auth: false, message: err.msg });
      return;
    }
    var info = await ethereum.pet(id);
    res.status(200).json(info);
  });
};
