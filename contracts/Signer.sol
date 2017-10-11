/*
  Copyright 2017 Contraktor Legal Tech
*/

pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/*
 * @title Signer
 * @dev The digital representation of the person who signs a contract by using the CKSign funcitons
 * any account is capable to sign a contract if the account is party of the contract of course.
 */
contract Signer is Ownable {
  address public signer;
  uint public signedAt;

  /**
   * @dev signer of the contract with the public address
   * @param _signer public address
   */
  function Signer(address _signer) {
    signer = _signer;
  }

  /**
   * @dev sign a contract setting the signedAt with block timestamp
   */
  function sign() {
    signedAt = block.timestamp;
  }

  /**
   * @dev check if the signer signed the contract by checking signedAt
   * @return boolean indicating if the signer signed
   */
  function isSigned() constant returns(bool signed) {
    return signedAt != 0;
  }
}
