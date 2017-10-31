const shajs = require('sha.js');

// const CKSignManager = artifacts.require('./CKSignManager.sol');
// const CKSignKernel = artifacts.require('./CKSignKernel.sol');
const CKSignStorage = artifacts.require('./CKSignStorage.sol');

// const {
//   log,
//   JSONLog,
//   assertTransaction,
//   assertEventFired
// } = require('./support');

contract('CKSign Smart Contracts', accs => {
  let CKSignManagerInstance;
  let CKSignStorageInstance;

  beforeEach(async () => {
    CKSignStorageInstance = await CKSignStorage.deployed();
    log('CKSignStorage deployed at:', CKSignStorageInstance.address);

    // CKSignManagerInstance = await CKSignManager.deployed(CKSignStorageInstance.address);
    // log('CKSignManager deployed at:', CKSignManagerInstance.address);
  });

  describe('CKSign', () => {
    it('should deploy CKSign with success', async () => {
      // const name = await CKSignManagerInstance.NAME.call();
      // assert.equal(name, 'CKSign');
    });

    // it('should upgrade with success', async () => {
    //   const txResult = await CKSignManagerInstance.upgradeCKSignKernel({ from: accs[0] });
    //   assertTransaction(txResult);
    //   assertEventFired(txResult, 'CKSignKernelUpgraded');
    // });
  });

  // describe('CKSignKernel', () => {
  //   let assetDigest;
  //   let ckSignKernelInstance;

  //   const owner = accs[0];
  //   const parties = accs.slice(1, 3);

  //   beforeEach(async () => {
  //     const sha3 = shajs('sha256')
  //       .update(Math.random().toString())
  //       .digest('hex');

  //     assetDigest = `0x${sha3}`;
  //     log('assetDigest:', assetDigest);

  //     const address = await CKSignManagerInstance.ckSignKernel.call();
  //     log('CkSignKernel at:', address);
  //     ckSignKernelInstance = await CKSignKernel.at(address);
  //   });

  //   it('should deploy CKSignKernel with success', async () => {
  //     const name = await ckSignKernelInstance.NAME.call();
  //     assert.equal(name, 'CKSignKernel');
  //   });

  //   it('should sign an asset with success', async () => {
  //     const txResult = await ckSignKernelInstance.newDigitalContract(assetDigest, parties, { from: owner });
  //     assertTransaction(txResult);
  //   });
  // });
});
