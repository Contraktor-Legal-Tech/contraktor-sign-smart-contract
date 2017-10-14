const ContraktorSign = artifacts.require('./ContraktorSign.sol');

const JSONLog = (log) => console.log(JSON.stringify(log, null, 2));

contract('ContraktorSign', accounts => {
  const contractHash = '42bcb1227d9b3e7efb7574a372639cadcdf7f247da7a580c7a34f3422956b9ee';
  const account_1 = accounts[1];
  const account_2 = accounts[2];
  const account_3 = accounts[3];
  const othersAccounts = [account_1, account_2];

  const deployContraktorSign = () => (
    ContraktorSign.deployed()
  );

  const deployContraktorSignDigitalContract = async () => {
    const instance = await deployContraktorSign();
    await instance.newDigitalContract(contractHash);
    return instance;
  };

  const deployContraktorSignDigitalContractWithSigners = async () => {
    const instance = await deployContraktorSign();
    await instance.newDigitalContract(contractHash);
    await instance.addSigners(contractHash, othersAccounts);
    return instance;
  }

  it('should deploy ContraktorSign with success', async () => {
    const instance = await deployContraktorSign();
    const name = await instance.NAME.call();
    assert.equal(name, 'ContraktorSign');
  });

  it('should add a new digital contract to ContraktorSign', async () => {
    const instance = await deployContraktorSign();
    const transactionResult = await instance.newDigitalContract(contractHash);
    const newDigitalContractFound = transactionResult.logs.find(log => log.event === 'DigitalContractAdded');
    assert.equal(newDigitalContractFound.args._ownerAddr === instance.address, true);
    assert.equal(!!newDigitalContractFound, true, "New DigitalContract isn't executed");
  });

  it('should cancel a digital contract', async () => {
    const instance = await deployContraktorSignDigitalContract();
    await instance.cancelDigitalContract(contractHash);
    const transactionResult = await instance.contractIsCanceled.call(contractHash);
    assert(transactionResult, true);
  });

  it('shouldn\'t new digtal contract been completed', async () => {
    const instance = await deployContraktorSign();
    const transactionResult = await instance.newDigitalContract(contractHash);
    const newDigitalContractFound = transactionResult.logs.find(log => log.event === 'DigitalContractAdded');
    const isCompleted = await instance.contractIsCompleted.call(contractHash);
    assert.equal(isCompleted, false, "New DigitalContract shouldn't be signed");
  });

  it('should create a digital contract and add signers', async () => {
    const instance = await deployContraktorSign();
    await instance.newDigitalContract(contractHash);
    const transactionResult = await instance.addSigners(contractHash, othersAccounts);
    const SignersAdded = transactionResult.logs.find(log => log.event === 'SignersAdded');
    assert.equal(SignersAdded.args._signers.every(_account => accounts.indexOf(_account) != -1), true);
  });

  it('should sign digital contract for all signers', async () => {
    const instance = await deployContraktorSignDigitalContractWithSigners();
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
    const instance = await deployContraktorSignDigitalContractWithSigners();
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
    const instance = await deployContraktorSignDigitalContractWithSigners();
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
    const instance = await deployContraktorSignDigitalContractWithSigners();
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
    const instance = await deployContraktorSignDigitalContractWithSigners();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(contractHash, account_1, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, true, "Signer should be valid for the contract");
  });

  it('should confirm that a signer isn\t participating in a contract', async () => {
    const instance = await deployContraktorSignDigitalContractWithSigners();
    await instance.signDigitalContract(contractHash, { from: account_1 });
    await instance.signDigitalContract(contractHash, { from: account_2 });
    const transactionResult = await instance.signerIsValid(contractHash, account_3, { from: account_2 });
    const SignerIsValid = transactionResult.logs.find(log => log.event === 'SignerIsValid');
    assert.equal(SignerIsValid.args._valid, false, "Signer should be invalid for the contract");
  });
});
