'use strict';

exports.create = function(req, res) {
  console.log('POST pets');
  console.log(req.body);
  res.json(200);
};