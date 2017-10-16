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
  mapping(string => DigitalContract) contracts;

  /*
  *  Events
  */

  event DigitalContractAdded(
    string _documentHash,
    address _ownerAddr
  );

  event SignersAdded(
    string _documentHash,
    address[] _signers
  );

  event DigitalContractSigned(
    string _documentHash,
    address _signer
  );

  event DigitalContractCanceled(
    string _documentHash,
    address _ownerAddr
  );

  event SignerIsValid(
    string _documentHash,
    address _signer,
    bool _valid
  );

  /*
  *  Core functions
  */

  /**
  * @dev creates a new digital contract with checksum hash and add signers
  * @param _documentHash checksum of the document to be added
  * @param _signers address of the accounts to sign the digital contract
  */
  function newDigitalContract(string _documentHash, address[] _signers) public onlyOwner {
    require(contracts[_documentHash] == address(0x0));
    require(_signers.length > 0);

    var ckDigitalContract = new DigitalContract(_documentHash);
    contracts[_documentHash] = ckDigitalContract;
    DigitalContractAdded(_documentHash, ckDigitalContract.owner());

    contracts[_documentHash].addSigners(_signers);
    SignersAdded(_documentHash, _signers);
  }

  /**
   * @dev cancel a digital contract forever
   * @param _documentHash checksum of the document to be canceled
   */
  function cancelDigitalContract(string _documentHash) public  onlyOwner {
    require(contracts[_documentHash] != address(0x0));
    contracts[_documentHash].cancel();
    DigitalContractCanceled(_documentHash, msg.sender);
  }

  /**
   * @dev account can sign the digital contract by the contract hash
   * @param _documentHash checksum of the document to be signed
   */
  function signDigitalContract(string _documentHash) public  {
    require(contracts[_documentHash] != address(0x0));
    contracts[_documentHash].sign(msg.sender);
    DigitalContractSigned(_documentHash, msg.sender);
  }

  /**
   * @dev checks if the signer is participating in an contract
   * @param _documentHash checksum of the document to be checked
   * @param _signer account to be test if is a valid signer in the contract specified
   */
  function signerIsValid(string _documentHash, address _signer) public  {
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
  function contractIsCompleted(string _documentHash) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].completedAt() != 0;
  }

  /**
   * @dev check if the digital contract is canceled
   * @param _documentHash checksum of the document to check if is canceled
   * @return boolean indicating if the contract is canceled
   */
  function contractIsCanceled(string _documentHash) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].canceledAt() != 0;
  }

  /**
   * @dev returns the signed time of the contract in unix timestamp format
   * @param _documentHash checksum of the document to check the timestamp of completion
   * @return uint with the unix timestamp of the completion of the document
   */
  function contractSignedTime(string _documentHash) constant returns (uint) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].completedAt();
  }

  /**
   * @dev returns if the given signer already signed
   * @param _documentHash checksum of the document to check
   * @return boolean indicating if the signer already signed
   */
  function isContractSignedBySigner(string _documentHash, address _signer) constant returns (bool) {
    require(contracts[_documentHash] != address(0x0));
    return contracts[_documentHash].signerSigned(_signer);
  }
}
