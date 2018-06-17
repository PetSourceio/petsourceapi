pragma solidity ^0.4.23;
contract PetsVault {

  struct Pet {
    string guid;
    string name;
    string breed;
    string chipId;
    string sex;
    uint256 birthDate;
    string imageUrl;
    address owner;
  }

  event AddingPetStarted(string _guid, address _owner);
  event PetExistsCheckingOwnerShip(string _guid, address _owner);
  event AssigningNewPetToOwner(string _guid, address _owner);
  event CreatingOrUpdatingPetObject(string _guid, address _owner);
  event AssigningNewPetToPetVault(string _guid, address _owner);
  event AssigningChipIdList(string _guid, string _chipId);
  event ReturningPetSaved(string _guid, address _owner);

  // id => pet mapping
  mapping(uint256 => Pet) public pets;

  // guids => id mapping
  mapping(bytes32 => uint256) public guids;

  // chipId => id mapping
  mapping(bytes32 => uint256) public chips;

  // owner => id mapping for owned pets
  mapping(address => uint256[]) public ownership;

  uint256 public petCount = 0;

  constructor() public {
  }

  function add(
    string _guid,
    string _name,
    string _breed,
    string _chipId,
    string _sex,
    uint256 _birthDate,
    string _imageUrl,
    address _owner) public {

    emit AddingPetStarted(_guid, _owner);
    bytes32 _guidBytes = stringToBytes32(_guid);

    uint256 _petId = petCount;

    require(_guidBytes.length != 0);
    require(_owner != address(0));

    if(guids[_guidBytes] != 0) {
      emit PetExistsCheckingOwnerShip(_guid, _owner);
      _petId = guids[_guidBytes];
      require(pets[_petId].owner == _owner);
    } else {
      emit AssigningNewPetToOwner(_guid, _owner);
      ownership[_owner].push(_petId);
      petCount = petCount + 1;
    }

    emit CreatingOrUpdatingPetObject(_guid, _owner);
    Pet memory _pet = Pet(
      _guid, _name, _breed, _chipId, _sex, _birthDate,
      _imageUrl, _owner);

    emit AssigningNewPetToPetVault(_guid, _owner);
    pets[_petId] = _pet;
    guids[_guidBytes] = _petId;


    bytes32 _chipBytes = stringToBytes32(_chipId);
    if (_chipBytes.length != 0) {
      emit AssigningChipIdList(_guid, _chipId);
      chips[_chipBytes] = _petId;
    }

    emit ReturningPetSaved(_guid, _owner);
  }

  function byGuid(string _guid) public view returns (uint256) {
    bytes32 _guidBytes = stringToBytes32(_guid);
    if (guids[_guidBytes] != 0) {
      return guids[_guidBytes];
    }
    return 0;
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
