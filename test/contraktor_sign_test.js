const shajs = require('sha.js');

const ContraktorSign = artifacts.require('./ContraktorSign.sol');
const ContraktorSignKernel = artifacts.require('./ContraktorSignKernel.sol');

const {
  log,
  JSONLog,
  assertTransaction,
  assertEventFired
} = require('./support');

contract('ContraktorSign Smart Contracts', accs => {
  let ckSignInstance;

  beforeEach(async () => {
    ckSignInstance = await ContraktorSign.deployed();
    log('ContraktorSign deployed at:', ckSignInstance.address);
  });

  describe('ContraktorSign', () => {
    it('should deploy ContraktorSign with success', async () => {
      const name = await ckSignInstance.NAME.call();
      assert.equal(name, 'ContraktorSign');
    });

    it('should upgrade with success', async () => {
      const txResult = await ckSignInstance.upgradeCKSignKernel({ from: accs[0] });
      assertTransaction(txResult);
      assertEventFired(txResult, 'ContraktorSignKernelUpgraded');
    });
  });

  describe('ContraktorSignKernel', () => {
    let assetDigest;
    let ckSignKernelInstance;

    const owner = accs[0];
    const parties = accs.slice(1, 3);

    beforeEach(async () => {
      const sha3 = shajs('sha256')
        .update(Math.random().toString())
        .digest('hex');

      assetDigest = `0x${sha3}`;
      log('assetDigest:', assetDigest);

      const address = await ckSignInstance.contraktorSignKernel.call();
      log('CkSignKernel at:', address);
      ckSignKernelInstance = await ContraktorSignKernel.at(address);
    });

    it('should deploy ContraktorSignKernel with success', async () => {
      const name = await ckSignKernelInstance.NAME.call();
      assert.equal(name, 'ContraktorSignKernel');
    });

    it.only('should sign an asset with success', async () => {
      const txResult = await ckSignKernelInstance.newDigitalContract(assetDigest, parties, { from: owner });
      assertTransaction(txResult);
    });
  });
});
