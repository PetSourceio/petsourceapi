'use strict';

module.exports = function(app) {
    var contactRequestController = require('../controllers/contactRequestController');

    app.route('/contact/:userId/request/:petId')
        .post(contactRequestController.request);

    app.route('/contact/:userId/request/received')
        .get(contactRequestController.received);

    app.route('/contact/:userId/request/sent')
        .get(contactRequestController.sent);

    app.route('/contact/:userId/request/:reqId/aproove')
        .post(contactRequestController.aproove);

    app.route('/contact/:userId/request/:reqId/decline')
        .post(contactRequestController.decline);
}
