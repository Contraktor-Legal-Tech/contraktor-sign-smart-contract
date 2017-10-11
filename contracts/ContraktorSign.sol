/*
  Copyright 2017 Contraktor Legal Tech
*/

pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import "./DigitalContract.sol";

/*
 * @title ContraktorSign
 * @dev Main contract which control the creation and the signing of new digital contracts,
 * it has the ownership to add new contracts, add new signers and let the signers
 * to sign a particular document by the checksum hash of the document
 */
contract ContraktorSign is Ownable, Destructible {
  string constant public VERSION = "1.0.0";
  string constant public NAME = "ContraktorSign";

  // All digital contracts managed by Contraktor
  mapping(bytes => DigitalContract) contracts;

  /*
  *  Events
  */

  event DigitalContractAdded(
    bytes _documentHash,
    address _ownerAddr
  );

  event SignersAdded(
    bytes _documentHash,
    address[] _signers
  );

  event DigitalContractSigned(
    bytes _documentHash,
    address _signer
  );

  event DigitalContractCanceled(
    bytes _documentHash,
    address _ownerAddr
  );

  event SignerIsValid(
    bytes _documentHash,
    address _signer,
    bool _valid
  );

  /*
  *  Core functions
  */

  /**
   * @dev creates a new digital contract with checksum hash
   * @param _documentHash checksum of the document to be added
   */
  function newDigitalContract(bytes _documentHash) onlyOwner {
    var ckDigitalContract = new DigitalContract(_documentHash);
    contracts[_documentHash] = ckDigitalContract;
    DigitalContractAdded(_documentHash, ckDigitalContract.owner());
  }

  /**
   * @dev add accounts to sign the digital contract
   * @param _documentHash checksum of the document to add the signers
   * @param _signers address of the accounts to sign the digital contract
   */
  function addSigners(bytes _documentHash, address[] _signers) onlyOwner {
    require(contracts[_documentHash] != address(0x0));
    require(_signers.length > 0);
    contracts[_documentHash].addSigners(_signers);
    SignersAdded(_documentHash, _signers);
  }

  /**
   * @dev cancel a digital contract forever
   * @param _documentHash checksum of the document to be canceled
   */
  function cancelDigitalContract(bytes _documentHash) onlyOwner {
    require(contracts[_documentHash] != address(0x0));
    contracts[_documentHash].cancel();
    DigitalContractCanceled(_documentHash, msg.sender);
  }

  /**
   * @dev account can sign the digital contract by the contract hash
   * @param _documentHash checksum of the document to be signed
   */
  function signDigitalContract(bytes _documentHash) {
    require(contracts[_documentHash] != address(0x0));
    contracts[_documentHash].sign(msg.sender);
    DigitalContractSigned(_documentHash, msg.sender);
  }

  /**
   * @dev checks if the signer is participating in an contract
   * @param _documentHash checksum of the document to be checked
   * @param _signer account to be test if is a valid signer in the contract specified
   */
  function signerIsValid(bytes _documentHash, address _signer) {
    require(contracts[_documentHash] != address(0x0));
    var isValid = contracts[_documentHash].signerIsValid(_signer);
    SignerIsValid(_documentHash, _signer, isValid);
  }

  /*
   * Getters
   */

  /**
   * @dev check if the digital contract is signed by all signers
   * @param _documentHash checksum of the document to check if is signed
   * @return boolean indicating if the contract is signed
   */
  function contractIsCompleted(bytes _documentHash) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].completedAt() != 0;
  }

  /**
   * @dev check if the digital contract is canceled
   * @param _documentHash checksum of the document to check if is canceled
   * @return boolean indicating if the contract is canceled
   */
  function contractIsCanceled(bytes _documentHash) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].canceledAt() != 0;
  }

  /**
   * @dev returns the signed time of the contract in unix timestamp format
   * @param _documentHash checksum of the document to check the timestamp of completion
   * @return uint with the unix timestamp of the completion of the document
   */
  function contractSignedTime(bytes _documentHash) constant returns (uint) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].completedAt();
  }

  /**
   * @dev returns if the given signer already signed
   * @param _documentHash checksum of the document to check
   * @return boolean indicating if the signer already signed
   */
  function isContractSignedBySigner(bytes _documentHash, address _signer) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].signerSigned(_signer);
  }
}
