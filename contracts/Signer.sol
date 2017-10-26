pragma solidity 0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

/**
  * Accounts which will sign the specified digital contract
  */
contract Signer is Ownable, Destructible  {
  // Time of sign in blocktime
  uint signedAt;
}
