pragma solidity ^0.4.23;
// Deployed at Ropsten 0x1102d789255594a51fd9c4f336badbd173313f5d
contract PetsVault {

  struct Pet {
    string name;
    string breed;
    // FIXME: should it be string?? Not sure what formats chipIds are
    uint256 chipId;
    address owner;
  }

  // chipId => pet mapping
  mapping(uint256 => Pet) public pets;

  // owner => chipId's mapping for owned pets
  mapping(address => uint256[]) public ownership;

  constructor() public {
  }

  function add(string _name, string _breed, uint256 _chipId) public {
    if(pets[_chipId].owner != address(0)) {
      require(pets[_chipId].owner == msg.sender);
    } else {
      ownership[msg.sender].push(_chipId);
    }

    Pet memory _pet = Pet(_name, _breed, _chipId, msg.sender);
    pets[_chipId] = _pet;
  }

  function noPets() public view returns (uint256) {
    return ownership[msg.sender].length;
  }

}
