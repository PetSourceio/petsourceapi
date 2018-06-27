'use strict';

var bcrypt = require('bcryptjs');
var config = require('../config');
var ethereum = require('../services/ethereum');
var authentication = require('../services/authentication');

var mongoose = require('mongoose'),
  Wallet = mongoose.model('Wallet'),
  ObjectId = mongoose.Types.ObjectId;

exports.byChipId = async (req, res) => {
  console.log('GET pets/search/chip/:chipId');
  console.log(req.params.chipId);
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var chipId = req.params.chipId;
    var result = [];
    var petCount = await ethereum.petCount();
    console.log('Found pet count: ' + petCount);
    for (var i = 0; i < petCount; i++) {
      var pet = await ethereum.petByNo(i);
      if (pet.chipNumber == chipId) {
        pet.id = i;
        result.push(pet);
      }
    }
    res.status(200).json(result);
  });
}

exports.byBreed = async (req, res) => {
  console.log('GET pets/search/breed/:breed');
  console.log(req.params.breed);
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var breed = req.params.breed;
    var result = [];
    var petCount = await ethereum.petCount();
    console.log('Found pet count: ' + petCount);
    for (var i = 0; i < petCount; i++) {
      var pet = await ethereum.petByNo(i);
      if (pet.breed == breed) {
        pet.id = i;
        result.push(pet);
      }
    }
    res.status(200).json(result);
  });
}

exports.byType = async (req, res) => {
  console.log('GET pets/search/type/:type');
  console.log(req.params.type);
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var type = req.params.type;
    var result = [];
    var petCount = await ethereum.petCount();
    res.status(501).json();
  });
}

exports.byCountry = async (req, res) => {
  console.log('GET pets/search/country/:country');
  console.log(req.params.country);
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }
    var country = req.params.country;
    var result = [];
    var petCount = await ethereum.petCount();
    res.status(501).json();
  });
}
