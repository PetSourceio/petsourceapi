'use strict';

module.exports = function(app) {
    var petSearch = require('../controllers/petSearchController');

    app.route('/search/:userId/pet/chip/:chipId')
        .get(petSearch.byChipId);

    app.route('/search/:userId/pet/breed/:breed')
        .get(petSearch.byBreed);

    app.route('/search/:userId/pet/type/:type')
        .get(petSearch.byType);

    app.route('/search/:userId/pet/country/:country')
        .get(petSearch.byCountry);

};
