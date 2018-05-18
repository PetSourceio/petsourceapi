'use strict';
const http = require('http');
const express = require('express');
const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet');
const Tx = require('ethereumjs-tx');
const fs = require("fs");
const config = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/84DFybjezfxbFO2BQV6e"));

const contractObj = JSON.parse(fs.readFileSync("./build/contracts/PetsVault.json", "utf8"));
const petsVault = web3.eth.contract(contractObj.abi).at(config.petsVaultAddress);

exports.createWallet = function(email, password) {
    console.log('Creating wallet for ' + email);
    var passwordToHash = email + password;
    var privateKey = web3.sha3(passwordToHash);
    var key = Buffer.from(privateKey.replace('0x', ''), 'hex');
    var wallet = Wallet.fromPrivateKey(key);
    var accountAddress = '0x' + wallet.getAddress().toString('hex');
    console.log('Created wallet for ' + email + ', address ' + accountAddress);
    return wallet.toV3String(password);
};
