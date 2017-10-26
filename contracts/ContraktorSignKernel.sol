pragma solidity 0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

import './SignLibrary.sol';

contract ContraktorSignKernel is Ownable, Destructible {
  using SignLibrary for address;
  address public contraktorSignStorage;

  function ContraktorSignKernel(address _contraktorSignStorage) {
    contraktorSignStorage = _contraktorSignStorage;
  }

  function newDigitalContract(bytes32 _documentHash, address[] _signers) {
    contraktorSignStorage.newDigitalContract(_documentHash, _signers);
  }
}

