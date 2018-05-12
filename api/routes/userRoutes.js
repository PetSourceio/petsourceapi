'use strict';

module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/users')
    .post(user.create);

  app.route('/users/login')
    .post(user.login);

  app.route('/users/info')
    .get(user.info);

  app.route('/users/:userId/pets')
    .get(user.petList);

  app.route('/users/:userId/wallet')
    .get(user.wallet);
};