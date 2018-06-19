const config = require('../config');
const GoogleSignIn = require('google-sign-in');
const project = new GoogleSignIn.Project(config.googleClientId);

exports.validateToken = function(email, token, args, callback) {
  console.log(config.googleClientId);
  console.log(token);
  project.verifyToken(token).then((jsonData) => {
      if (jsonData.email != email) {
        console.log('Bad token provided for user');
        callback({status: 401, msg: 'Bad token provided for user'});
      }
      console.log('Token aprooved. Proceeding...');
      callback(null, args);
  }, (err) => {
      console.log('Error while checking token, cause: ' + err);
      callback({status: 500, msg: 'Error while authenticating'});
  });
}
