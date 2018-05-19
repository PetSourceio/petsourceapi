'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    userId: {
      type: String,
      required: true
    },
    walletString: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

WalletSchema.methods.toJSON = function() {
    var object = this.toObject();
    delete object.password;
    delete object.__v;
    return object;
}

module.exports = mongoose.model('Wallet', WalletSchema);
