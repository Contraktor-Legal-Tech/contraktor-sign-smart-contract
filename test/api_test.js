if (process.env.TEST_TYPE !== 'api') return;

const assert = require('assert');
const request = require('supertest');
const app = require('../index.js');
const truffleConfig = require('../truffle');

describe('API', () => {
  const contractHash = '42bcb1227d9b3e7efb7574a372639cadcdf7f247da7a580c7a34f3422956b9ee';

  it('should get the name of the contract', () => {
    return request(app)
      .get('/api/name')
      .expect(200)
      .then(result => {
        assert.equal(result.body.result, 'ContraktorSign', 'Wrong smart contract name');
      });
  });

  it('should get all accounts', () => {
    return request(app)
      .get('/api/accounts')
      .expect(200)
      .then(result => {
        assert.equal(result.body.result.length > 0, true, 'Should return all accounts');
      });
  });

  it('should create a new account', () => {
    return request(app)
      .post('/api/accounts')
      .send({passwd: 'some-secure-pass'})
      .expect(201)
      .then(result => {
        assert.equal(/0x.+/.test(result.body.result), true, 'Should return the account address');
      });
  });

  it('should create a new digital contract', async () => {
    const result = await request(app)
      .get('/api/accounts')
      .expect(200);

    let account = result.body.result[0];
    let signers = result.body.result.slice(1,3);

    return request(app)
      .post('/api/digital_contract')
      .send({contractHash, account, signers})
      .expect(201)
      .then(result => {
        console.log('result', JSON.stringify(result.body.result, null, 2));
        assert.equal(/0x.+/.test(result.body.result.tx), true, 'Should return the transaction address');
        // assert.equal(result.body.result.receipt.status, '0x1', 'Transaction failed'); // only in Byzantium
      });
  });
});
