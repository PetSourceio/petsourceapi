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

exports.pet = async (guid) => {
  console.log('Getting pet info by chip id ' + guid);
  var petNo = await petsVault.byGuid.call(guid);
  return this.petByNo(petNo);
}

exports.petByNo = async (petNo) => {
  console.log('Getting pet details ' + petNo);
  var pet = await petsVault.pets.call(petNo);
  console.log('Got pet' + pet);
  return {guid: pet[0], name: pet[1], breed: pet[2], chipNumber: pet[3], sex: pet[4],
  birthDate: pet[5]*1000, imageUrl: pet[6]};
}

exports.petByChipId = async (chipId) => {
  console.log('Getting pet info by chip id ' + guid);
  var petId = await petsVault.byChipId.call(guid);
  return this.petByNo(petId);
}

exports.listPets = async (wallet) => {
  console.log('Getting pets for ' + wallet);
  var no = await petsVault.noPets.call({from: wallet});
  console.log(wallet + ' has ' + no + ' pets. Getting pets info...');
  var infos = [];
  for (var i = 0; i < no; i++) {
    var id = await petsVault.ownership.call(wallet, i,{from: wallet});
    var info = await this.petByNo(id);
    console.log(info);
    infos.push(info);
  }
  return infos;
}

exports.storePet = async (pet, userWalletAddress) => {
  console.log('Storing pet: ' + pet)
  if (!pet.guid) {
    throw new Error('Guid is null!');
  }

  var petName = pet.name ? pet.name : '';
  var petBreed = pet.breed ? pet.breed : '';
  var petChipNumber = pet.chipNumber ? pet.chipNumber : '';
  var petSex = pet.sex ? pet.sex : '';
  var petBirthDate = pet.birthDate ? new Date(pet.birthDate).getTime() / 1000 : '';
  var petImageUrl = pet.imageUrl ? pet.imageUrl : '';

  var encodedData = petsVault.add.getData(pet.guid, petName, petBreed, petChipNumber,
  petSex, petBirthDate, petImageUrl, userWalletAddress);

  var account = this.getWalletAddress(config.mainWalletInfo, config.mainWalletPsw);
  var nonce = await web3.eth.getTransactionCount(account);
  var userWallet = Wallet.fromV3(config.mainWalletInfo, config.mainWalletPsw);

  web3.eth.defaultAccount = account;

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
