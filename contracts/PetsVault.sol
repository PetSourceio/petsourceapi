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

  event AddingPetStarted(uint256 _chipId, address _owner);
  event PetExistsCheckingOwnerShip(uint256 _chipId, address _owner);
  event AssigningNewPetToOwner(uint256 _chipId, address _owner);
  event CreatingOrUpdatingPetObject(uint256 _chipId, address _owner);
  event AssigningNewPetToPetVault(uint256 _chipId, address _owner);
  event ReturningPetSaved(uint256 _chipId, address _owner);

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
    string _color,
    address _owner) public {

    emit AddingPetStarted(_chipId, _owner);

    require(_owner != address(0));

    if(pets[_chipId].owner != address(0)) {
      emit PetExistsCheckingOwnerShip(_chipId, _owner);
      require(pets[_chipId].owner == _owner);
    } else {
      emit AssigningNewPetToOwner(_chipId, _owner);
      ownership[_owner].push(_chipId);
    }

    emit CreatingOrUpdatingPetObject(_chipId, _owner);
    Pet memory _pet = Pet(
      _name, _breed, _chipId, _sex, _birthDate, _species,
      _color, _owner);

    emit AssigningNewPetToPetVault(_chipId, _owner);
    pets[_chipId] = _pet;
    emit ReturningPetSaved(_chipId, _owner);
  }

  function noPets() public view returns (uint256) {
    return ownership[msg.sender].length;
  }

}
