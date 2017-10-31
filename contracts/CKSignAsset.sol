pragma solidity 0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

import './CKSignSigner.sol';

/**
  * The digital contract identifier and signers
  */
contract CKSignAsset is Ownable, Destructible {
  // The unique identifier of the document
  bytes32 documentHash;

  // Just to check if is empty
  bool isValid;

  // Variables to control the state of the digital contract
  uint createdAt;
  uint canceledAt;
  uint completedAt;

  uint signersCount;

  // All signers of this contract
  mapping(address => CKSignSigner) signers;

  function CKSignAsset(bytes32 _documentHash) {
    documentHash = _documentHash;
  }

  function addSigner(address _signer) {
    signers[_signer] = CKSignSigner(_signer);
  }
}
