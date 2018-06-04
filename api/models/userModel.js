'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    countryOfResidence: {
        type: String,
        required: true
    },
    authPlatform: {
      type: String,
      required: true
    }
});

UserSchema.methods.toJSON = function() {
    var object = this.toObject();
    delete object.password;
    delete object.__v;
    return object;
}

module.exports = mongoose.model('User', UserSchema);
