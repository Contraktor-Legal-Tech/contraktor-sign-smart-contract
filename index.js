const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const contract = require('truffle-contract');
const fs = require('fs');

// Setting Web3
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

// Setting ContraktorSign
const contractSchema = require('./build/contracts/ContraktorSign.json');
const ContraktorSign = contract(contractSchema);
ContraktorSign.setProvider(provider);

// https://github.com/trufflesuite/truffle-contract/issues/57
if (typeof ContraktorSign.currentProvider.sendAsync !== "function") {
  ContraktorSign.currentProvider.sendAsync = function () {
    return ContraktorSign.currentProvider.send.apply(
      ContraktorSign.currentProvider, arguments
    );
  };
}

// Setting Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const router = express.Router();

router.get('/name', async (req, res) => {
  try {
    const instance = await ContraktorSign.deployed();
    const result = await instance.NAME();
    res.json({ result });
  } catch(error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/accounts', async (req, res) => {
  const result = await web3.eth.getAccounts();
  res.json({ result});
});

router.post('/accounts', async (req, res) => {
  try {
    if (!req.body.passwd) {
      throw Error('Password of the new accounts is required');
    }

    const passwd = req.body.passwd;
    const result = await web3.eth.personal.newAccount(passwd);
    res.status(201).json({ result });
  } catch(error) {
    console.error(error);
    res.status(400).json({error: error.message});
  }
});

router.post('/digital_contract', async (req, res) => {
  try {
    if (!req.body.contractHash) {
      throw Error('Contract hash is required');
    }

    if (!req.body.account) {
      throw Error('Account is required');
    }

    if (!req.body.signers) {
      throw Error('Signers array is required');
    }

    console.log('request body:', req.body);

    const contractHash = req.body.contractHash;
    const from = req.body.account;
    const signers = req.body.signers;

    const instance = await ContraktorSign.deployed();

    const result = await instance.newDigitalContract(contractHash, signers, { from, gas: 1000000 });
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.use('/api', router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port);
}

module.exports = app;
