'use strict';

exports.create = function(req, res) {
  console.log('POST users');
  console.log(req.body);
  res.status(200).json(1);
};

exports.login = function(req, res) {
  console.log('POST users/login');
  console.log(req.body);
  res.status(200).json(1);
};

exports.info = function(req, res) {
  console.log('GET users/info');
  res.status(200).json({email: "someName@email.com"});
};

exports.petList = function(req, res) {
  var id = req.params.id;
  console.log('GET users/info');
  console.log('userId: ' + id);
  res.status(200).json([{name: "pet1"}, {name: "pet2"}]);
};