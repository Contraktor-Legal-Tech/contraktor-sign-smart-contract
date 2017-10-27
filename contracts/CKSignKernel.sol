pragma solidity 0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

import './CKSignLibrary.sol';

contract CKSignKernel is Ownable, Destructible {
  string constant public NAME = "CKSignKernel";

  using CKSignLibrary for address;
  address public ckSignStorageAddr;

  event AddingDigitalContract(bytes32 _documentHash, address[] _signers);
  event DigitalContractAdded(bytes32 _documentHash, address[] _signers, uint _createdAt);
  event DigitalContractSigned(bytes32 _documentHash, address _signer, int _signedAt);
  event DigitalContractCompleted(bytes32 _documentHash, uint _completedAt);
  event DigitalContractCanceled(bytes32 _documentHash, uint _canceledAt);
  event SignerIsValid(bytes32 _documentHash, address _signer, bool _valid);

  function CKSignKernel(address _ckSignStorageAddr) {
    ckSignStorageAddr = _ckSignStorageAddr;
  }

  // function newCKSignAsset(bytes32 _documentHash, address[] _signers) onlyOwner {
  //   AddingDigitalContract(_documentHash, _signers);
  //   // ckSignStorage.newCKSignAsset(_documentHash, _signers);
  //   DigitalContractAdded(_documentHash, _signers, now);
  // }
}
