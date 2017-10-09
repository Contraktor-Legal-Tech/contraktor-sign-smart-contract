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

  const deployContraktorSignDigitalContract = () => {
    return deployContraktorSign().then(instance => {
      return instance.newDigitalContract(contractHash).then(() => {
        return instance;
      });
    });
  }

  const deployContraktorSignDigitalContractWithSigners = () => {
    return deployContraktorSign().then(instance => {
      return instance.newDigitalContract(contractHash).then(() => {
        return instance.addSigners(contractHash, othersAccounts);
      }).then(() => instance);
    });
  }

  it('should deploy ContraktorSign with success', () => {
    return deployContraktorSign().then(instance => {
      return instance.NAME().then(name => {
        assert.equal(name, "ContraktorSign");
      });
    });
  });

  it('should add a new digital contract to ContraktorSign', () => {
    return deployContraktorSign().then(instance => {
      return instance.newDigitalContract(contractHash).then(result => {
        const newDigitalContractFound = result.logs.find(log => log.event === 'DigitalContractAdded');
        assert.equal(newDigitalContractFound.args._ownerAddr === instance.address, true);
        assert.equal(!!newDigitalContractFound, true, "New DigitalContract isn't executed");
      });
    });
  });

  it('should cancel a digital contract', () => {
    return deployContraktorSignDigitalContract().then(instance => {
      return instance.cancelDigitalContract(contractHash).then(result => {
        return instance.contractIsCanceled(contractHash);
      });
    }).then(result => assert(result, true));
  });

  it('shouldn\'t new diigtal contract been completed', () => {
    return deployContraktorSign().then(instance => {
      return instance.newDigitalContract(contractHash).then(result => {
        const newDigitalContractFound = result.logs.find(log => log.event === 'DigitalContractAdded');
        return instance.contractIsCompleted.call(contractHash);
      });
    }).then(result => {
      assert.equal(result, false, "New DigitalContract shouldn't be signed");
    })
  });

  it('should create a digital contract and add signers', () => {
    return deployContraktorSign().then(instance => {
      return instance.newDigitalContract(contractHash).then(result => {
        return instance.addSigners(contractHash, othersAccounts);
      }).then(result => {
        const SignersAdded = result.logs.find(log => log.event === 'SignersAdded');
        assert.equal(SignersAdded.args._signers.every(_account => accounts.indexOf(_account) != -1), true);
      });
    });
  });

  it('should sign digital contract for all signers', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.signDigitalContract(contractHash, { from: account_1 }).then(() => {
        return instance.signDigitalContract(contractHash, { from: account_2 });
      }).then(() => {
        return instance.isContractSignedBySigner.call(contractHash, account_1).then(result => {
          assert(result, true, `Contract not signed by account ${account_1}`);
        }).then(() => {
          return instance.isContractSignedBySigner.call(contractHash, account_3).then(result => {
            assert(result, false, `Contract signed by account ${account_3} is invalid`);
          }).then(() => { throw "It should give an error"; })
          .catch(err => {
            assert.equal(err instanceof(Error), true);
          });
        });
      });
    })
  });

  it('shouldn\'t sign a canceled digital contract', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.cancelDigitalContract(contractHash).then(result => {
        return instance.signDigitalContract(contractHash, { from: account_1 });
      });
    })
    .then(() => { throw "It should give an error"; })
    .catch(err => {
      assert.equal(err instanceof (Error), true);
    });
  });

  it('shouldn\'t cancel a canceled digital contract', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.cancelDigitalContract(contractHash).then(result => {
        return instance.cancelDigitalContract(contractHash);
      });
    })
    .then(() => { throw "It should give an error"; })
    .catch(err => {
      assert.equal(err instanceof(Error), true);
    });
  });

  it('shouldn\'t sign a completed digital contract', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.signDigitalContract(contractHash, { from: account_1 }).then(() => {
        return instance.signDigitalContract(contractHash, { from: account_2 });
      }).then(() => {
        return instance.signDigitalContract(contractHash, { from: account_2 });
      });
    })
    .then(() => { throw "It should give an error"; })
    .catch(err => {
      assert.equal(err instanceof(Error), true, "Should give an error due the contract already signed");
    });
  });

  it('should confirm that a signer is participating in a contract', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.signDigitalContract(contractHash, { from: account_1 }).then(() => {
        return instance.signDigitalContract(contractHash, { from: account_2 });
      }).then(() => {
        return instance.signerIsValid(contractHash, account_1, { from: account_2 });
      });
    }).then(result => {
      const SignerIsValid = result.logs.find(log => log.event === 'SignerIsValid');
      assert.equal(SignerIsValid.args._valid, true, "Signer should be valid for the contract");
    });
  });

  it('should confirm that a signer isn\t participating in a contract', () => {
    return deployContraktorSignDigitalContractWithSigners().then(instance => {
      return instance.signDigitalContract(contractHash, { from: account_1 }).then(() => {
        return instance.signDigitalContract(contractHash, { from: account_2 });
      }).then(() => {
        return instance.signerIsValid(contractHash, account_3, { from: account_2 });
      });
    }).then(result => {
      const SignerIsValid = result.logs.find(log => log.event === 'SignerIsValid');
      assert.equal(SignerIsValid.args._valid, false, "Signer should be invalid for the contract");
    });
  });
});
