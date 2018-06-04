'use strict';
var graph = require('fbgraph');

exports.validateToken = function(email, token, args, callback) {
  graph.setAccessToken(token);

  graph.get("me?fields=id,name,email", function(err, fbInfo) {
    if (err){
      console.log('Error while checking token, cause: ' + err);
      callback({status: 500, msg: 'Error while authenticating'});
    } else if (fbInfo.email != email) {
      console.log('Bad token provided for user');
      callback({status: 401, msg: 'Bad token provided for user'});
    }
    console.log('Token aprooved. Proceeding...');
    callback(null, args);
  });
}
