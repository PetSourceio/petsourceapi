'use strict';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var ethereum = require('../services/ethereum');

var mongoose = require('mongoose'),
  Wallet = mongoose.model('Wallet'),
  ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
    console.log('POST pets');

    var token = req.headers['x-access-token'];
    if (!token) {
      res.status(401).send({ auth: false, message: 'No token provided.' });
      return;
    }

    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err){
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        return;
      }
      console.log('Getting wallet for ' + req.body.userID);
      Wallet.findOne({ userId : req.body.userID }, async function(err, walletInfo) {
        if (err){
          res.send(err);
          return;
        }
        if (walletInfo){
          var passwordIsValid = bcrypt.compareSync(req.body.password, walletInfo.password);
          if (!passwordIsValid){
            res.status(403).send({
              message: 'User password was incorrect.'
            });
            return;
          }

          var tx = await ethereum.storePet(req.body, walletInfo.walletString, req.body.password);
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
  var status = await ethereum.transactionStatus(req.params.txId);
  console.log('Tx' + req.params.txId + ' status ' + status)
  res.status(200).json(status);
};

exports.info = async (req, res) => {
  var id = req.params.petId;
  console.log('GET pets/:petId');
  console.log('petId: ' + id);

  var token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).send({ auth: false, message: 'No token provided.' });
    return;
  }

  jwt.verify(token, config.secret, async function(err, decoded) {
    if (err){
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return;
    }
    var info = await ethereum.pet(id);
    res.status(200).json(info);
  });
};
