pragma solidity ^0.4.4;

/*
 * @title Ownable
 * @dev Provides onlyOwner modifier, which prevents function from running if it is called by anyone
 * other than the owner.
 */
contract Ownable {
  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) external onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }
}
