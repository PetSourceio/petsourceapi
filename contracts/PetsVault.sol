pragma solidity ^0.4.23;
contract PetsVault {

  struct Pet {
    uint256 guid;
    string name;
    string breed;
    string chipId;
    string sex;
    uint256 birthDate;
    string species;
    string imageUrl;
    address owner;
  }

  event AddingPetStarted(uint256 _guid, address _owner);
  event PetExistsCheckingOwnerShip(uint256 _guid, address _owner);
  event AssigningNewPetToOwner(uint256 _guid, address _owner);
  event CreatingOrUpdatingPetObject(uint256 _guid, address _owner);
  event AssigningNewPetToPetVault(uint256 _guid, address _owner);
  event AssigningChipIdList(uint256 _guid, string _chipId);
  event ReturningPetSaved(uint256 _guid, address _owner);

  // id => pet mapping
  mapping(uint256 => Pet) public pets;

  // chipId => id mapping
  mapping(bytes32 => uint256) public chips;

  // owner => id mapping for owned pets
  mapping(address => uint256[]) public ownership;

  constructor() public {
  }

  function add(
    uint256 _guid,
    string _name,
    string _breed,
    string _chipId,
    string _sex,
    uint256 _birthDate,
    string _species,
    string _imageUrl,
    address _owner) public {

    emit AddingPetStarted(_guid, _owner);

    require(_guid != 0);
    require(_owner != address(0));

    if(pets[_guid].owner != address(0)) {
      emit PetExistsCheckingOwnerShip(_guid, _owner);
      require(pets[_guid].owner == _owner);
    } else {
      emit AssigningNewPetToOwner(_guid, _owner);
      ownership[_owner].push(_guid);
    }

    emit CreatingOrUpdatingPetObject(_guid, _owner);
    Pet memory _pet = Pet(
      _guid, _name, _breed, _chipId, _sex, _birthDate, _species,
      _imageUrl, _owner);

    emit AssigningNewPetToPetVault(_guid, _owner);
    pets[_guid] = _pet;

    bytes32 _chipBytes = stringToBytes32(_chipId);
    if (_chipBytes.length != 0) {
      emit AssigningChipIdList(_guid, _chipId);
      chips[_chipBytes] = _guid;
    }

    emit ReturningPetSaved(_guid, _owner);
  }

  function byChipId(string _chipId) public view returns (uint256) {
    bytes32 _chipBytes = stringToBytes32(_chipId);
    if (chips[_chipBytes] != 0) {
      return chips[_chipBytes];
    }
    return 0;
  }

  function noPets() public view returns (uint256) {
    return ownership[msg.sender].length;
  }

  function stringToBytes32(string memory source) internal returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
      }

      assembly {
          result := mload(add(source, 32))
      }
  }

}
