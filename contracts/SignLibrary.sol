pragma solidity ^0.4.5;

import './ContraktorSignStorage.sol';
import './DigitalContract.sol';
import './Signer.sol';

library SignLibrary {
  function newDigitalContract(address _contraktorSignStorage, bytes32 _documentHash, address[] _signers) {
    ContraktorSignStorage contraktorSignStorage = ContraktorSignStorage(_contraktorSignStorage);

    assert(contraktorSignStorage.getDigitalContract(_documentHash) == 0x0);

    DigitalContract digitalContract = new DigitalContract(_documentHash);

    // for (uint i = 0; i < _signers.length; i++) {
    //   assert(_signers[i] != 0x0);

    //   // Adding signer to the contract signers map
    //   Signer signer = new Signer();
    //   digitalContract.addSigner(address(signer));
    // }

    contraktorSignStorage.addDigitalContract(_documentHash, address(digitalContract));
  }
}
