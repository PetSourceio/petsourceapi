'use strict';

module.exports = function(app) {
  var pet = require('../controllers/petController');

  app.route('/pets')
    .post(pet.create);
};