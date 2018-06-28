'use strict';

module.exports = function(app) {
    var pet = require('../controllers/petController');

    app.route('/pets')
        .post(pet.create);

    app.route('/pets/:txId/status')
        .get(pet.creationStatus);

    app.route('/pets/:petId')
        .get(pet.info);

    app.route('/pets/search')
        .post(pet.search);
};
