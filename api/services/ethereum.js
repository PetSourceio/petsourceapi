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

exports.getWalletAddress = (accountKeystoreInfo, password) => {
    console.log('Getting wallet address');
    var wallet = Wallet.fromV3(accountKeystoreInfo, password);
    return '0x' + wallet.getAddress().toString('hex');
};

exports.getEthBalance = async (wallet) => {
  console.log("Getting balance for " + wallet);
  return await web3.eth.getBalance(wallet);
}

exports.pet = async (chipId) => {
  console.log('Getting pet info by chip id ' + chipId);
  var pet = await petsVault.pets.call(chipId);
  var birthDate = new Date(pet[4]*1000);
  var birthDateString =  [birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()].join('-');
  return {name: pet[0], breed: pet[1], chipNumber: pet[2], sex: pet[3],
  birthDate: birthDateString, species: pet[5], color: pet[6]};
}

exports.listPets = async (wallet) => {
  console.log('Getting pets for ' + wallet);
  var no = await petsVault.noPets.call({from: wallet});
  console.log(wallet + ' has ' + no + ' pets. Getting pets info...');
  var infos = [];
  for (var i = 0; i < no; i++) {
    var id = await petsVault.ownership.call(wallet, i,{from: wallet});
    var info = await this.pet(id);
    console.log(info);
    infos.push(info);
  }
  return infos;
}

exports.storePet = async (pet, accountKeystoreInfo, password) => {
  console.log('Storing pet: ' + pet)
  var account = this.getWalletAddress(accountKeystoreInfo, password);
  web3.eth.defaultAccount = account;
  var nonce = await web3.eth.getTransactionCount(account);
  var encodedData = petsVault.add.getData(pet.name, pet.breed, pet.chipNumber,
  pet.sex, new Date(pet.birthDate).getTime() / 1000, pet.species, pet.color);
  var userWallet = Wallet.fromV3(accountKeystoreInfo, password);

  var rawTx = {
    from: account,
    nonce: web3.toHex(nonce),
    gasPrice: web3.toHex('50000000'),
    gasLimit: web3.toHex('500000'),
    to: config.petsVaultAddress,
    data: encodedData,
  }
  var tx = new Tx(rawTx);
  tx.sign(userWallet.getPrivateKey());
  var serializedTx = tx.serialize();
  var txHash = await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  console.log('Transaction sent to network: ' + txHash);
  return txHash;
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