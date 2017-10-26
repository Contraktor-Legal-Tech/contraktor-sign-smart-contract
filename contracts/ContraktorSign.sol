pragma solidity ^0.4.15;

import './base/Ownable.sol';
import './base/Destructible.sol';

import './ContraktorSignStorage.sol';
import './ContraktorSignKernel.sol';

contract ContraktorSign is Ownable, Destructible {
  string constant public NAME = "ContraktorSign";

  address public contraktorSignKernel;

  event ContraktorSignKernelUpgraded(address _contraktorSignKernel, uint _now);
  event AddingDigitalContract(bytes32 _documentHash, address[] _signers);
  event DigitalContractAdded(bytes32 _documentHash, address[] _signers, uint _createdAt);
  event DigitalContractSigned(bytes32 _documentHash, address _signer, int _signedAt);
  event DigitalContractCompleted(bytes32 _documentHash, uint _completedAt);
  event DigitalContractCanceled(bytes32 _documentHash, uint _canceledAt);
  event SignerIsValid(bytes32 _documentHash, address _signer, bool _valid);

  function ContraktorSign() {
    var contraktorSignStorage = new ContraktorSignStorage();
    contraktorSignKernel = new ContraktorSignKernel(contraktorSignStorage);
  }

  function upgradeContraktorSignKernel() onlyOwner {
    ContraktorSignKernel contraktorSignKernelOld = ContraktorSignKernel(contraktorSignKernel);
    var contraktorSignKernelNew = new ContraktorSignKernel(contraktorSignKernelOld.contraktorSignStorage());
    contraktorSignKernelOld.destroyAndSend(contraktorSignKernelNew);
    contraktorSignKernel = contraktorSignKernelNew;
    ContraktorSignKernelUpgraded(contraktorSignKernel, now);
  }

  function newDigitalContract(bytes32 _documentHash, address[] _signers) onlyOwner {
    AddingDigitalContract(_documentHash, _signers);
    ContraktorSignKernel contraktorSignKernelOld = ContraktorSignKernel(contraktorSignKernel);
    contraktorSignKernelOld.newDigitalContract(_documentHash, _signers);
    DigitalContractAdded(_documentHash, _signers, now);
  }
}
