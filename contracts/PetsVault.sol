pragma solidity ^0.4.23;
contract PetsVault {

  struct Pet {
    string name;
    string breed;
    uint256 chipId;
    string sex;
    uint256 birthDate;
    string species;
    string color;
    address owner;
  }

  // chipId => pet mapping
  mapping(uint256 => Pet) public pets;

  // owner => chipId's mapping for owned pets
  mapping(address => uint256[]) public ownership;

  constructor() public {
  }

  function add(
    string _name,
    string _breed,
    uint256 _chipId,
    string _sex,
    uint256 _birthDate,
    string _species,
    string _color) public {

    if(pets[_chipId].owner != address(0)) {
      require(pets[_chipId].owner == msg.sender);
    } else {
      ownership[msg.sender].push(_chipId);
    }

    Pet memory _pet = Pet(
      _name, _breed, _chipId, _sex, _birthDate, _species,
      _color, msg.sender);
    pets[_chipId] = _pet;
  }

  function noPets() public view returns (uint256) {
    return ownership[msg.sender].length;
  }

}
