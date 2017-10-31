pragma solidity ^0.4.5;

import './CKSignStorage.sol';
import './CKSignAsset.sol';
import './CKSignSigner.sol';

library CKSignLibrary {
  // function newCKSignAsset(address _CKSignStorage, bytes32 _documentHash, address[] _signers) {
  //   CKSignStorage ckSignStorage = CKSignStorage(_CKSignStorage);

  //   assert(ckSignStorage.getCKSignAsset(_documentHash) == 0x0);

  //   CKSignAsset asset = new CKSignAsset(_documentHash);

  //   // for (uint i = 0; i < _signers.length; i++) {
  //   //   assert(_signers[i] != 0x0);

  //   //   // Adding signer to the contract signers map
  //   //   Signer signer = new Signer();
  //   //   asset.addSigner(address(signer));
  //   // }

  //   ckSignStorage.addCKSignAsset(_documentHash, address(asset));
  // }
}
