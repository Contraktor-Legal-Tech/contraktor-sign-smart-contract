pragma solidity ^0.4.15;

import './base/Ownable.sol';

import './ContraktorSignStorage.sol';
import './ContraktorSignKernel.sol';

contract ContraktorSign is Ownable {
  string constant public NAME = "ContraktorSign";

  address public contraktorSignKernel;

  event ContraktorSignKernelUpgraded(address _contraktorSignKernel, uint _now);

  function ContraktorSign() {
    var contraktorSignStorage = new ContraktorSignStorage();
    ContraktorSignStorage(contraktorSignStorage).transferOwnership(msg.sender);

    contraktorSignKernel = new ContraktorSignKernel(contraktorSignStorage);
    ContraktorSignKernel(contraktorSignKernel).transferOwnership(msg.sender);
  }

  function upgradeCKSignKernel() onlyOwner {
    ContraktorSignKernel contraktorSignKernelOld = ContraktorSignKernel(contraktorSignKernel);
    // var contraktorSignKernelNew = new ContraktorSignKernel(contraktorSignKernelOld.contraktorSignStorage());
    // contraktorSignKernelNew.transferOwnership(msg.sender);
    // contraktorSignKernelOld.destroyAndSend(contraktorSignKernelNew);
    // contraktorSignKernel = contraktorSignKernelNew;
    ContraktorSignKernelUpgraded(contraktorSignKernel, now);
  }
}
