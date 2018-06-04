'use strict';
var fbAuth = require('./fbAuth');

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Types.ObjectId;

exports.validateToken = function(platform, email, token, args, callback) {
   if (platform == 'FB') {
     fbAuth.validateToken(email, token, args, callback);
   } else if (platform == 'GOOGLE') {
     callback({status: 405, msg: 'Google not supported yet'});
   } else if (platform == 'CIVIC') {
     callback({status: 405, msg: 'Civic not supported yet'});
   } else {
     callback({status: 405, msg: 'Unknown login platform!'});
   }
}

exports.validateUserLogin = function(user, token, args, callback) {
  this.validateLogin(user._id, token, args, callback);
}

exports.validateLogin = function(userId, token, args, callback) {
  if (!token) {
    console.log('No token provided');
    callback({status: 401, msg: 'No token provided.'});
  }

  User.findOne({_id : new ObjectId(userId) }, function(err, user) {
    if (err) {
      console.log('Error while retrieving user from db, cause: '+ err);
      callback({status: 401, msg: 'Error while retrieving user from db'});
    }
    if (!user) {
      console.log('User not found while authenticating');
      callback({status: 404, msg: 'User not found'});
    }

   if (user.authPlatform == 'FB') {
    fbAuth.validateToken(user.email, token, args, callback);
  } else if (user.authPlatform == 'GOOGLE') {
    callback({status: 405, msg: 'Google not supported yet'});
  } else if (user.authPlatform == 'CIVIC') {
    callback({status: 405, msg: 'Civic not supported yet'});
  } else {
    callback({status: 405, msg: 'Unknown login platform!'});
  }

  });
}
