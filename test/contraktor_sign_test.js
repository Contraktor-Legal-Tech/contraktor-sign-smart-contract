if (process.env.TEST_TYPE !== 'contract') return;

const shajs = require('sha.js');
const ContraktorSign = artifacts.require('./ContraktorSign.sol');

const JSONLog = (log) => console.log(JSON.stringify(log, null, 2));

contract('ContraktorSign', accounts => {
  console.log('accounts', accounts);

  let documentHash;
  const account_1 = accounts[1];
  const account_2 = accounts[2];
  const account_3 = accounts[3];
  const othersAccounts = [account_1, account_2];

  beforeEach((done) => {
    documentHash = shajs('sha256').update(Math.random().toString()).digest('hex');
    done();
  });

  const deployContraktorSign = async () => {
    console.log('documentHash', documentHash);
    const instance = await ContraktorSign.deployed();
    await instance.newDigitalContract(documentHash, othersAccounts);
    return instance;
  }

  it('should deploy ContraktorSign with success', async () => {
    const instance = await deployContraktorSign();
    const name = await instance.NAME.call();
    assert.equal(name, 'ContraktorSign');
  });

  it('should add a new digital contract to ContraktorSign', async () => {
    const instance = await ContraktorSign.deployed();
    const transactionResult = await instance.newDigitalContract(documentHash, othersAccounts);
    const newDigitalContractFound = transactionResult.logs.find(log => log.event === 'DigitalContractAdded');
    assert.equal(newDigitalContractFound.args._ownerAddr === instance.address, true);
    assert.equal(!!newDigitalContractFound, true, "New DigitalContract isn't executed");
  });

  it('should cancel a digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(documentHash);
    const transactionResult = await instance.contractIsCanceled.call(documentHash);
    assert(transactionResult, true);
  });

  it('shouldn\'t new digtal contract been completed', async () => {
    const instance = await deployContraktorSign();
    const isCompleted = await instance.contractIsCompleted.call(documentHash);
    assert.equal(isCompleted, false, "New DigitalContract shouldn't be signed");
  });

  it('should sign digital contract for all signers', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(documentHash, { from: account_1 });
    await instance.signDigitalContract(documentHash, { from: account_2 });
    const isContractSignedByAccount1 = await instance.isContractSignedBySigner.call(documentHash, account_1)
    assert(isContractSignedByAccount1, true, `Contract not signed by account ${account_1}`);
  });

  it('shouldn\'t sign a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(documentHash);

    try {
      await instance.signDigitalContract(documentHash, { from: account_1 });
    } catch(err) {
      // nop
    }
  });

  it('shouldn\'t cancel a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(documentHash);

    try {
      await instance.cancelDigitalContract(documentHash);
    } catch(err) {
      // nop
    }
  });

  it('shouldn\'t sign a completed digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(documentHash, { from: account_1 });
    await instance.signDigitalContract(documentHash, { from: account_2 });

    try {
      await instance.signDigitalContract(documentHash, { from: account_2 });
    } catch(err) {
      // nop
    }
  });

  it('should confirm that a signer is participating in a contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(documentHash, { from: account_1 });
    await instance.signDigitalContract(documentHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(documentHash, account_1, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, true, "Signer should be valid for the contract");
  });

  it('should confirm that a signer isn\t participating in a contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(documentHash, { from: account_1 });
    await instance.signDigitalContract(documentHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(documentHash, account_3, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, false, "Signer should be invalid for the contract");
  });
});
