/*
  Copyright 2017 Contraktor Legal Tech
*/

pragma solidity ^0.4.4;

import "./base/Ownable.sol";
import "./Signer.sol";

/**
 * @title DigitalContract
 * @dev Contract which combines parties and the hash of the document, the hash is the checksum
 * for the document in his digital format.
 */
contract DigitalContract is Ownable {
  // Error codes
  enum Errors {
    CONTRACT_COMPLETED, // Contract is completed with all signatures
    CONTRACT_CANCELED, // Contract is canceld and cannot be used anymore
    INVALID_SIGNER,    // Invalid signer added
    SIGNER_SIGNED      // Signer already signed the contract
  }

  // All signers of this contract
  mapping(address => Signer) public signers;

  // List of the signers for iterate quick
  Signer[] public signerList;

  // the unique identifier of the document
  bytes documentHash;

  // variables to control the state of the digital contract
  uint public createdAt;
  uint public completedAt;
  uint public canceledAt;

  /**
   * Events
   */

  event LogError(uint8 _errorId, bytes _documentHash);

  /**
   * @dev adds a new digital contract
   * @param _documentHash checksum of the document to be added to this smart contract
   */
  function DigitalContract(bytes _documentHash) {
    documentHash = _documentHash;

    // Marks the hour of creation using bloch time
    createdAt = block.timestamp;
  }

  /**
   * @dev adds signers to this smart contract
   * @param _signersAddr array which contains the public address of the signers
   */
  function addSigners(address[] _signersAddr) onlyOwner {
    if (canceledAt != 0x0) {
      LogError(uint8(Errors.CONTRACT_CANCELED), documentHash);
      revert();
    }

    // Adding each signer by public address of the signer
    for (uint i = 0; i < _signersAddr.length; i++) {
      if (_signersAddr[i] == 0x0) {
        LogError(uint8(Errors.INVALID_SIGNER), documentHash);
        revert();
      }

      var _signerAddr = _signersAddr[i];
      var ckSigner = new Signer(_signerAddr);

      signers[_signerAddr] = ckSigner;
      signerList.push(ckSigner);
    }
  }

  /**
   * @dev cancel this digital contract forever if isn't canceled or signed
   */
  function cancel() onlyOwner {
    if (canceledAt != 0x0) {
      LogError(uint8(Errors.CONTRACT_CANCELED), documentHash);
      revert();
    }

    if (completedAt != 0x0) {
      LogError(uint8(Errors.CONTRACT_COMPLETED), documentHash);
      revert();
    }

    canceledAt = block.timestamp;
  }

  /**
   * @dev sign that contract using the account of the signer
   * @param _signerAddr public address of the signer
   */
  function sign(address _signerAddr) onlyOwner {
    require(_signerAddr != 0x0);
    require(signers[_signerAddr] != address(0x0));

    if (canceledAt != 0x0) {
      LogError(uint8(Errors.CONTRACT_CANCELED), documentHash);
      revert();
    }

    if (completedAt != 0x0) {
      LogError(uint8(Errors.CONTRACT_COMPLETED), documentHash);
      revert();
    }

    if (signers[_signerAddr].isSigned()) {
      LogError(uint8(Errors.SIGNER_SIGNED), documentHash);
      revert();
    }

    signers[_signerAddr].sign();

    uint signerCount = 0;
    for (uint i = 0; i < signerList.length; i++) {
      if (signerList[i].isSigned()) {
        signerCount++;
      }
    }

    if (signerCount == signerList.length) {
      completedAt = block.timestamp;
    }
  }
}
