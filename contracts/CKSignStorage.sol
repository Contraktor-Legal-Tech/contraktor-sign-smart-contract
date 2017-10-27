pragma solidity 0.4.15;

import './base/Ownable.sol';

import './CKSignAsset.sol';

contract CKSignStorage is Ownable {
  mapping(bytes32 => address) contracts;

  // function getCKSignAsset(bytes32 _documentHash) constant returns(address) {
  //   return address(contracts[_documentHash]);
  // }

  // function addCKSignAsset(bytes32 _documentHash, address _CKSignAsset) onlyOwner {
  //   contracts[_documentHash] = _CKSignAsset;
  // }
}
