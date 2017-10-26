pragma solidity ^0.4.15;

/*
  Copyright 2017 Contraktor Legal Tech
*/

import './Ownable.sol';
import './Destructible.sol';

/*
 * @title ContraktorSign
 * @dev Main contract which control the creation and the signing of new digital contracts,
 * it has the ownership to add new contracts, add new signers and let the signers
 * to sign a particular document by the checksum hash of the document
 */
contract ContraktorSign is Ownable, Destructible {
  string constant public VERSION = "1.0.0";
  string constant public NAME = "ContraktorSign";

  /**
   * Structs
   */

  /**
   * Accounts which will sign the specified digital contract
   */
  struct Signer {
    // Time of sign in blocktime
    uint signedAt;
  }

  /**
   * The digital contract identifier and signers
   */
  struct DigitalContract {
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
    mapping(address => Signer) signers;
  }

  // All digital contracts managed by Contraktor
  mapping(bytes32 => DigitalContract) public contracts;

  /*
  *  Events
  */

  // Contract is about to be processed
  event AddingDigitalContract(
    bytes32 _documentHash,
    address[] _signers
  );

  // Digital contract added and finish the transaction
  event DigitalContractAdded(
    bytes32 _documentHash,
    address[] _signers,
    uint _createdAt
  );

  // Digital contract signed by a party account
  event DigitalContractSigned(
    bytes32 _documentHash,
    address _signer,
    uint _signedAt
  );

  // Digital contract is completed
  event DigitalContractCompleted(
    bytes32 _documentHash,
    uint _completedAt
  );

  // Digital contract canceled
  event DigitalContractCanceled(
    bytes32 _documentHash,
    uint _canceledAt
  );

  // Digital contract signer is valid test
  event SignerIsValid(
    bytes32 _documentHash,
    address _signer,
    bool _valid
  );

  /**
   * Modifiers
   */

  // Check if no previous contract exists
  modifier noContractShouldExists(bytes32 _documentHash) {
    if (contracts[_documentHash].isValid) {
      revert();
    }
    _;
  }

  // Check if signers is greater than one
  modifier requireSigners(address[] _signers) {
    if (_signers.length == 0) {
      revert();
    }
    _;
  }

  // Check if contract previous exists
  modifier contractExists(bytes32 _documentHash) {
    if (!contracts[_documentHash].isValid) {
      revert();
    }
    _;
  }

  // Check if contract isn't completed
  modifier contractIsntCompleted(bytes32 _documentHash) {
    if (contracts[_documentHash].completedAt != 0) {
      revert();
    }
    _;
  }

  // Check if contract isn't canceled
  modifier contractIsntCanceled(bytes32 _documentHash) {
    if (contracts[_documentHash].canceledAt != 0) {
      revert();
    }
    _;
  }

  // Check if signer already signed the contract
  modifier signerSigned(bytes32 _documentHash) {
    if (contracts[_documentHash].signers[msg.sender].signedAt != 0) {
      revert();
    }
    _;
  }

  /**
   *  Core functions
   */

  /**
   * @dev creates a new digital contract with checksum hash and add signers
   * @param _documentHash checksum of the document to be added
   * @param _signers address of the accounts to sign the digital contract
   */
  function newDigitalContract(bytes32 _documentHash, address[] _signers) public
    onlyOwner noContractShouldExists(_documentHash) requireSigners(_signers)
  {
    AddingDigitalContract(_documentHash, _signers);
    contracts[_documentHash] = DigitalContract(_documentHash, true, block.timestamp, 0, 0, _signers.length);

    // Adding each signer by public address of the signer
    for (uint i = 0; i < _signers.length; i++) {
      if (_signers[i] == 0x0) {
        revert();
      }

      // Adding signer to the contract signers map
      contracts[_documentHash].signers[_signers[i]] = Signer(0);
    }

    DigitalContractAdded(_documentHash, _signers,  block.timestamp);
  }

  /**
   * @dev cancel a digital contract forever
   * @param _documentHash checksum of the document to be canceled
   */
  function cancelDigitalContract(bytes32 _documentHash) public
    onlyOwner contractExists(_documentHash)
    contractIsntCompleted(_documentHash) contractIsntCanceled(_documentHash)
  {
    // Mark the block timestamp indicating canceled == true
    contracts[_documentHash].canceledAt = block.timestamp;
    DigitalContractCanceled(_documentHash,  block.timestamp);
  }

  /**
   * @dev account can sign the digital contract by the contract hash
   * @param _documentHash checksum of the document to be signed
   */
  function signDigitalContract(bytes32 _documentHash) public
    contractExists(_documentHash) contractIsntCompleted(_documentHash)
    contractIsntCanceled(_documentHash) signerSigned(_documentHash)
  {
    contracts[_documentHash].signers[msg.sender].signedAt = block.timestamp;
    contracts[_documentHash].signersCount--;

    DigitalContractSigned(_documentHash, msg.sender, block.timestamp);

    if (contracts[_documentHash].signersCount == 0) {
      contracts[_documentHash].completedAt = block.timestamp;
      DigitalContractCompleted(_documentHash, block.timestamp);
    }
  }

  /*
   * Getters
   */

  /**
   * @dev checks if the signer is participating in an contract
   * @param _documentHash checksum of the document to be checked
   * @param _signer account to be test if is a valid signer in the contract specified
   */
  function isContractSignedBySigner(bytes32 _documentHash, address _signer) public
    contractExists(_documentHash) constant returns (bool)
  {
    return contracts[_documentHash].signers[_signer].signedAt != 0;
  }

  /**
   * @dev check if the digital contract is signed by all signers
   * @param _documentHash checksum of the document to check if is signed
   * @return boolean indicating if the contract is signed
   */
  function contractIsCompleted(bytes32 _documentHash) public
    contractExists(_documentHash) constant returns (bool)
  {
    return contracts[_documentHash].completedAt != 0;
  }

  /**
   * @dev check if the digital contract is canceled
   * @param _documentHash checksum of the document to check if is canceled
   * @return boolean indicating if the contract is canceled
   */
  function contractIsCanceled(bytes32 _documentHash) public
    contractExists(_documentHash) constant returns (bool)
  {
    return contracts[_documentHash].canceledAt != 0;
  }

  /**
   * @dev returns the signed time of the contract in unix timestamp format
   * @param _documentHash checksum of the document to check the timestamp of completion
   * @return uint with the unix timestamp of the completion of the document
   */
  function contractSignedTime(bytes32 _documentHash) public
    contractExists(_documentHash) constant returns (uint)
  {
    return contracts[_documentHash].completedAt;
  }
}
