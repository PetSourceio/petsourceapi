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

    res.status(501).json();
  });

exports.received = async (req, res) => {
  console.log('GET /contact/{userId}/request/received');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }

    res.status(501).json();
  });

exports.sent = async (req, res) => {
  console.log('GET /contact/{userId}/request/sent');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }

    res.status(501).json();
  });

exports.aproove = async (req, res) => {
  console.log('GET /contact/{userId}/request/{reqId}/aproove');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }

    res.status(501).json();
  });

exports.decline = async (req, res) => {
  console.log('GET /contact/{userId}/request/{reqId}/decline');
  authentication.validateLogin(req.params.userId, req.headers['x-access-token'], {}, async function(err, data) {
    if (err) {
      res.status(err.status).json({ auth: false, message: err.msg });
      return;
    }

    res.status(501).json();
});
