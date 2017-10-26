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
    documentHash = `0x${shajs('sha256').update(Math.random().toString()).digest('hex')}`;
    console.log(documentHash, documentHash.length);
    done();
  });

  const deployContraktorSign = async () => {
    const instance = await ContraktorSign.deployed();
    await instance.newDigitalContract(documentHash, othersAccounts);
    return instance;
  }

  const assertEventFired = ({ logs }, eventName) => {
    const event = logs.find(log => log.event === eventName);
    assert.equal(!!event, true, `Event ${eventName} didn't happened`);
  }

  const assertTransaction = ({ receipt: { status } }) => {
    assert.equal(status, '0x1', "Transaction failed");
  }

  const assertTransactionFailed = ({ receipt: { status } }) => {
    assert.equal(status, '0x0', "Transaction worked");
  }

  it('should deploy ContraktorSign with success', async () => {
    const instance = await deployContraktorSign();
    const name = await instance.NAME.call();
    assert.equal(name, 'ContraktorSign');
  });

  it('should add a new digital contract to ContraktorSign', async () => {
    const instance = await ContraktorSign.deployed();
    const transactionResult = await instance.newDigitalContract(documentHash, othersAccounts);
    assertTransaction(transactionResult);
    assertEventFired(transactionResult, 'AddingDigitalContract');
    assertEventFired(transactionResult, 'DigitalContractAdded');
  });

  it('should cancel a digital contract', async () => {
    const instance = await deployContraktorSign();
    const transactionResult = await instance.cancelDigitalContract(documentHash);
    assertTransaction(transactionResult);
    assertEventFired(transactionResult, 'DigitalContractCanceled');
    const isCanceled = await instance.contractIsCanceled.call(documentHash);
    assert.equal(isCanceled, true, "New Digital Contract cant be canceled");
  });

  it('shouldn\'t new digital contract been completed', async () => {
    const instance = await deployContraktorSign();
    const isCompleted = await instance.contractIsCompleted.call(documentHash);
    assert.equal(isCompleted, false, "New Digital Contract shouldn't be signed");
  });

  it('should sign digital contract for all signers', async () => {
    const instance = await deployContraktorSign();

    let transactionResult = await instance.signDigitalContract(documentHash, { from: account_1 });
    assertTransaction(transactionResult);
    assertEventFired(transactionResult, 'DigitalContractSigned');

    transactionResult = await instance.signDigitalContract(documentHash, { from: account_2 });
    assertTransaction(transactionResult);
    assertEventFired(transactionResult, 'DigitalContractSigned');
    assertEventFired(transactionResult, 'DigitalContractCompleted');

    let event = await instance.isContractSignedBySigner.call(documentHash, account_1)
    assert(event, true, `Contract not signed by account ${account_1}`);

    event = await instance.isContractSignedBySigner.call(documentHash, account_2)
    assert(event, true, `Contract not signed by account ${account_2}`);
  });

  it('shouldn\'t sign a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    let transactionResult = await instance.cancelDigitalContract(documentHash);
    assertTransaction(transactionResult);
    assertEventFired(transactionResult, 'DigitalContractCanceled');

    transactionResult = await instance.signDigitalContract(documentHash, { from: account_1 });
    assertTransactionFailed(transactionResult);
  });

  it('shouldn\'t cancel a canceled digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.cancelDigitalContract(documentHash);
    let transactionResult = await instance.cancelDigitalContract(documentHash);
    assertTransactionFailed(transactionResult)
  });

  it('shouldn\'t sign a completed digital contract', async () => {
    const instance = await deployContraktorSign();
    await instance.signDigitalContract(documentHash, { from: account_1 });
    await instance.signDigitalContract(documentHash, { from: account_2 });
    let transactionResult = await instance.signDigitalContract(documentHash, { from: account_2 });
    assertTransactionFailed(transactionResult)
  });
});
