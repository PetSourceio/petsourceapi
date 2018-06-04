'use strict';

module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/users')
    .post(user.create);

  app.route('/users/:userId')
    .get(user.info);

  app.route('/users/:userId/pets')
    .get(user.petList);

  app.route('/users/:userId/wallet')
    .get(user.wallet);

  app.route('/users/:userId/wallet')
    .post(user.newWallet);

  app.route('/user/exists')
        .get(user.exists);
};
