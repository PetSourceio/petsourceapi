'use strict';

exports.create = function(req, res) {
    console.log('POST pets');
    console.log(req.body);
    res.status(200).json(1);
};

exports.info = function(req, res) {
    console.log('GET pets/:petId');
    console.log(req.body);
    res.status(200).json(1);
};