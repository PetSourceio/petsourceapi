'use strict';

exports.create = function(req, res) {
  console.log('POST users');
  console.log(req.body);
  res.json(200);
};

exports.login = function(req, res) {
  console.log('POST users/login');
  console.log(req.body);
  res.json(200);
};

exports.info = function(req, res) {
  //todo make this action only accessible after user has logged in
  console.log('GET users/info');
  res.json(200);
};