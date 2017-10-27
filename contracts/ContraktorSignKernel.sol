pragma solidity 0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

import './SignLibrary.sol';

contract ContraktorSignKernel is Ownable, Destructible {
  string constant public NAME = "ContraktorSignKernel";

  using SignLibrary for address;
  address public contraktorSignStorage;

  event AddingDigitalContract(bytes32 _documentHash, address[] _signers);
  event DigitalContractAdded(bytes32 _documentHash, address[] _signers, uint _createdAt);
  event DigitalContractSigned(bytes32 _documentHash, address _signer, int _signedAt);
  event DigitalContractCompleted(bytes32 _documentHash, uint _completedAt);
  event DigitalContractCanceled(bytes32 _documentHash, uint _canceledAt);
  event SignerIsValid(bytes32 _documentHash, address _signer, bool _valid);

  function ContraktorSignKernel(address _contraktorSignStorage) {
    contraktorSignStorage = _contraktorSignStorage;
  }

  function newDigitalContract(bytes32 _documentHash, address[] _signers) onlyOwner {
    AddingDigitalContract(_documentHash, _signers);
    contraktorSignStorage.newDigitalContract(_documentHash, _signers);
    DigitalContractAdded(_documentHash, _signers, now);
  }
}
