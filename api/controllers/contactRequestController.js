'use strict';
var config = require('../config');
var ethereum = require('../services/ethereum');
var authentication = require('../services/authentication');

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Wallet = mongoose.model('Wallet'),
  ContactRequest = mongoose.model('ContactRequest'),
  ObjectId = mongoose.Types.ObjectId;

exports.request = async (req, res) => {
  console.log('POST /contact/{userId}/request/{petId}');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    try {
      var petOwnerWallet = await ethereum.petOwnerWallet(req.params.petId);
      var wallet = await Wallet.findOne({ address : petOwnerWallet });
      if (!wallet) {
        res.status(409).json({ auth: false, message: 'User wallet not found' });
        return;
      }

      console.log(wallet);

      var contactRequest = new ContactRequest({
        requestBy: req.params.userId,
        requestTo: wallet.userId,
        requestToPetId: req.params.petId,
        status: 'PENDING',
        message: req.body.message
      });
      await contactRequest.save();
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json({ auth: false, message: 'Error while executing contact request' });
    }
  });
}

exports.received = async (req, res) => {
  console.log('GET /contact/{userId}/request/received');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    try {
      var requests = await ContactRequest.find({requestTo : req.params.userId});
      var results = [];
      for (var i = 0; i < requests.length; i++) {
        var request = requests[i];
        var user = await User.findOne({ _id : new ObjectId(request.requestBy) });
        var resultObj = {
          requestId: request._id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryOfResidence: user.countryOfResidence,
          message: request.message,
          status: request.status
        };
        results.push(resultObj);
      }
      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json({ auth: false, message: 'Error while executing contact request' });
    }
  });
}

exports.sent = async (req, res) => {
  console.log('GET /contact/{userId}/request/sent');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    try {
      var requests = await ContactRequest.find({requestBy : req.params.userId});
      var results = [];
      for (var i = 0; i < requests.length; i++) {
        var request = requests[i];
        var resultObj = {
          requestId: request._id,
          status: request.status,
          message: request.message
        };
        var pet = await ethereum.pet(request.requestToPetId);
        resultObj.pet = {
          name : pet.name,
          country : '',
          breed: pet.breed,
          type: ''
        }
        if (request.status == 'APROOVED') {
          var user = await User.findOne({ _id : new ObjectId(request.requestTo) });
          resultObj.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            countryOfResidence: user.countryOfResidence
          }
        }
        results.push(resultObj);
      }

      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json({ auth: false, message: 'Error while executing contact request' });
    }
  });
}

exports.aproove = async (req, res) => {
  console.log('GET /contact/{userId}/request/{reqId}/aproove');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    try {
      var request = await ContactRequest.findOne({ _id : new ObjectId(req.params.reqId)});
      if (!request) {
        res.status(404).json({message: 'Request not found' });
        return;
      }
      if (request.requestTo != req.params.userId) {
        res.status(405).json({message: 'request does not belong to this user' });
        return;
      }
      request.status = 'APROOVED';
      await request.save();
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json({ auth: false, message: 'Error while accepting request' });
    }
  });
}

exports.decline = async (req, res) => {
  console.log('GET /contact/{userId}/request/{reqId}/decline');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    try {
      var request = await ContactRequest.findOne({ _id : new ObjectId(req.params.reqId)});
      if (!request) {
        res.status(404).json({message: 'Request not found' });
        return;
      }
      if (request.requestTo != req.params.userId) {
        res.status(405).json({message: 'request does not belong to this user' });
        return;
      }
      request.status = 'DECLINED';
      await request.save();
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json({ auth: false, message: 'Error while declining request' });
    }
  });
}
