pragma solidity ^0.4.4;

import "./Ownable.sol";

/*
 * @title Terminable
 * @dev Provides a self destruct function which can be destroyed by the owner only
 */
contract Terminable is Ownable {
  function terminate() external onlyOwner {
    selfdestruct(owner);
  }
}
