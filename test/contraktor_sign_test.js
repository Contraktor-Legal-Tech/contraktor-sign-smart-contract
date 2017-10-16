if (process.env.TEST_TYPE !== 'contract') return;

const shajs = require('sha.js');
const ContraktorSign = artifacts.require('./ContraktorSign.sol');

const JSONLog = (log) => console.log(JSON.stringify(log, null, 2));

contract('ContraktorSign', accounts => {
  let contractHash;
  const account_1 = accounts[1];
  const account_2 = accounts[2];
  const account_3 = accounts[3];
  const othersAccounts = [account_1, account_2];

  beforeEach((done) => {
    contractHash = shajs('sha256').update(Math.random().toString()).digest('hex');
    done();
  });

  const deployContraktorSign = async () => {
    const instance = await ContraktorSign.deployed();
    await instance.newDigitalContract(contractHash, othersAccounts);
    return instance;
  }

  it('should deploy ContraktorSign with success', async () => {
    const instance = await deployContraktorSign();
    const name = await instance.NAME.call();
    assert.equal(name, 'ContraktorSign');
  });

  it('should add a new digital contract to ContraktorSign', async () => {
    const instance = await ContraktorSign.deployed();
    const transactionResult = await instance.newDigitalContract(contractHash, othersAccounts);
    const newDigitalContractFound = transactionResult.logs.find(log => log.event === 'DigitalContractAdded');
    assert.equal(newDigitalContractFound.args._ownerAddr === instance.address, true);
    assert.equal(!!newDigitalContractFound, true, "New DigitalContract isn't executed");
  });

  it('should cancel a digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(contractHash);
    const transactionResult = await instance.contractIsCanceled.call(contractHash);
    assert(transactionResult, true);
  });

  it('shouldn\'t new digtal contract been completed', async () => {
    const instance = await deployContraktorSign();
    const isCompleted = await instance.contractIsCompleted.call(contractHash);
    assert.equal(isCompleted, false, "New DigitalContract shouldn't be signed");
  });

  it('should sign digital contract for all signers', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });
    const isContractSignedByAccount1 = await instance.isContractSignedBySigner.call(contractHash, account_1)
    assert(isContractSignedByAccount1, true, `Contract not signed by account ${account_1}`);

    let error = false;
    try {
      await instance.isContractSignedBySigner.call(contractHash, account_3)
    } catch(err) {
      error = true;
    } finally {
      assert.equal(error, true, 'It should give an error');
    }
  });

  it('shouldn\'t sign a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(contractHash);

    let error = false;
    try {
      await instance.signDigitalContract(contractHash, { from: account_1 });
    } catch(err) {
      error = true;
    } finally {
      assert.equal(error, true, 'It should give an error');
    }
  });

  it('shouldn\'t cancel a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(contractHash);

    let error = false;
    try {
      await instance.cancelDigitalContract(contractHash);
    } catch(err) {
      error = true;
    } finally {
      assert.equal(error, true, 'It should give an error');
    }
  });

  it('shouldn\'t sign a completed digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });

    let error = false;
    try {
      await instance.signDigitalContract(contractHash, { from: account_2 });
    } catch(err) {
      error = true;
    } finally {
      assert.equal(error, true, 'It should give an error');
    }
  });

  it('should confirm that a signer is participating in a contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(contractHash, account_1, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, true, "Signer should be valid for the contract");
  });

  it('should confirm that a signer isn\t participating in a contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(contractHash, account_3, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, false, "Signer should be invalid for the contract");
  });
});
