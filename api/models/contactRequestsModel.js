'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactRequestSchema = new Schema({
    requestBy: {
        type: String,
        required: true
    },
    requestTo: {
        type: String,
        required: true
    },
    requestToPetId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    }
});

ContactRequestSchema.methods.toJSON = function() {
    var object = this.toObject();
    return object;
}

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);
