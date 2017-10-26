pragma solidity 0.4.15;

import './base/Ownable.sol';

import './DigitalContract.sol';

contract ContraktorSignStorage is Ownable {
  mapping(bytes32 => DigitalContract) contracts;

  function getDigitalContract(bytes32 _documentHash) constant returns(address) {
    return address(contracts[_documentHash]);
  }

  function addDigitalContract(bytes32 _documentHash, address _digitalContract) onlyOwner {
    contracts[_documentHash] = DigitalContract(_digitalContract);
  }
}
