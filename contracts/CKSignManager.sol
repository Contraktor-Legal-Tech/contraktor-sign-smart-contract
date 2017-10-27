pragma solidity ^0.4.15;

import './base/Ownable.sol';

import './CKSignStorage.sol';
import './CKSignKernel.sol';

contract CKSignManager is Ownable {
  string constant public NAME = "CKSign";

  address public ckSignKernelAddr;

  event CKSignKernelUpgraded(address _CKSignKernel, uint _now);

  function CKSignManager(address _ckSignStorageAddr) onlyOwner {
    require(_ckSignStorageAddr != 0x0);
    ckSignKernelAddr = new CKSignKernel(_ckSignStorageAddr);
    CKSignKernel(ckSignKernelAddr).transferOwnership(msg.sender);
  }

  function upgradeCKSignKernel() onlyOwner {
    CKSignKernel ckSignKernel = CKSignKernel(ckSignKernelAddr);
    var ckSignKernelNew = new CKSignKernel(ckSignKernel.ckSignStorageAddr());
    ckSignKernel.destroyAndSend(ckSignKernelNew);
    ckSignKernel = ckSignKernelNew;
    CKSignKernelUpgraded(ckSignKernelNew, now);
  }
}
