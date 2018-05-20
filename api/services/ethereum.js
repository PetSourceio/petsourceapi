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

exports.createWallet = (email, password) => {
    console.log('Creating wallet for ' + email);
    var passwordToHash = email + password;
    var privateKey = web3.sha3(passwordToHash);
    var key = Buffer.from(privateKey.replace('0x', ''), 'hex');
    var wallet = Wallet.fromPrivateKey(key);
    var accountAddress = '0x' + wallet.getAddress().toString('hex');
    console.log('Created wallet for ' + email + ', address ' + accountAddress);
    return wallet.toV3String(password);
};

<<<<<<< HEAD
<<<<<<< HEAD
exports.getWalletAddress = (accountKeystoreInfo, password) => {
=======
exports.getWalletAddress = function(accountKeystoreInfo, password) {
>>>>>>> Retrieve wallet info
=======
exports.getWalletAddress = (accountKeystoreInfo, password) => {
>>>>>>> add eth metods for pet storing and viewing
    console.log('Getting wallet address');
    var wallet = Wallet.fromV3(accountKeystoreInfo, password);
    return '0x' + wallet.getAddress().toString('hex');
};

<<<<<<< HEAD
<<<<<<< HEAD
exports.getEthBalance = async (wallet) => {
  console.log("Getting balance for " + wallet);
  return await web3.eth.getBalance(wallet);
}

exports.pet = async (chipId, wallet) => {
  return await petsVault.pets.call(chipId, {from: wallet})
}

exports.listPet = async (wallet) => {
  var no = await petsVault.noPets.call({from: wallet});
  var infos = [];
  for (var i = 0; i < no; i++) {
    var id = await petsVault.ownership.call(wallet, i,{from: wallet});
    var info = pet(id, wallet);
    infos.push(info);
  }
  return infos;
}

exports.storePet = async (accountKeystoreInfo, password) => {
  var account = getWalletAddress(accountKeystoreInfo, password);
  web3.eth.defaultAccount = account;
  var nonce = await web3.eth.getTransactionCount(account);
  // newer version user encodeAbi
  var encodedData = petsVault.add.getData(name, breed, chipId);
  var userWallet = Wallet.fromV3(accountKeystoreInfo, password);

  var rawTx = {
    from: account,
    nonce: web3.toHex(nonce),
    gasPrice: web3.toHex('50000000'),
    gasLimit: web3.toHex('500000'),
    to: contractAddress,
    data: encodedData,
  }
  var tx = new Tx(rawTx);
  tx.sign(userWallet.getPrivateKey());
  var serializedTx = tx.serialize();
  console.log('0x' + serializedTx.toString('hex'));
  await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (error, txHash) => {
      if(error) {
        console.log("Failed to send transaction to contract" + error);
        return;
      }

      console.log(txHash);
  });
}

exports.transactionStatus = async (txHash) => {
  var tx = await web3.eth.getTransactionReceipt(txHash);
  if (tx) {
    if (tx.status == '0x0') {
      return 'FAILED';
    } else if (tx.status == '0x1') {
      return 'SUCCESS';
    }
  } else {
    return 'PENDING';
  }
}
=======
exports.getEthBalance = async function(wallet) {
  console.log("Getting balance for " + wallet);
  return await web3.eth.getBalance(wallet);
}
>>>>>>> Retrieve wallet info
=======
exports.getEthBalance = async (wallet) => {
  console.log("Getting balance for " + wallet);
  return await web3.eth.getBalance(wallet);
}

exports.pet = async (chipId, wallet) => {
  return await petsVault.pets.call(chipId, {from: wallet})
}

exports.listPet = async (wallet) => {
  var no = await petsVault.noPets.call({from: wallet});
  var infos = [];
  for (var i = 0; i < no; i++) {
    var id = await petsVault.ownership.call(wallet, i,{from: wallet});
    var info = pet(id, wallet);
    infos.push(info);
  }
  return infos;
}

exports.storePet = async (accountKeystoreInfo, password) => {
  var account = getWalletAddress(accountKeystoreInfo, password);
  web3.eth.defaultAccount = account;
  var nonce = await web3.eth.getTransactionCount(account);
  // newer version user encodeAbi
  var encodedData = petsVault.add.getData(name, breed, chipId);
  var userWallet = Wallet.fromV3(accountKeystoreInfo, password);

  var rawTx = {
    from: account,
    nonce: web3.toHex(nonce),
    gasPrice: web3.toHex('50000000'),
    gasLimit: web3.toHex('500000'),
    to: contractAddress,
    data: encodedData,
  }
  var tx = new Tx(rawTx);
  tx.sign(userWallet.getPrivateKey());
  var serializedTx = tx.serialize();
  console.log('0x' + serializedTx.toString('hex'));
  await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (error, txHash) => {
      if(error) {
        console.log("Failed to send transaction to contract" + error);
        return;
      }

      console.log(txHash);
  });
}

exports.transactionStatus = async (txHash) => {
  var tx = await web3.eth.getTransactionReceipt(txHash);
  if (tx) {
    if (tx.status == '0x0') {
      return 'FAILED';
    } else if (tx.status == '0x1') {
      return 'SUCCESS';
    }
  } else {
    return 'PENDING';
  }
}
>>>>>>> add eth metods for pet storing and viewing
