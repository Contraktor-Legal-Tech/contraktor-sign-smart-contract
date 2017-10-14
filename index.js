const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/accounts', async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  res.json({accounts});
});

router.post('/accounts', async (req, res) => {
  try {
    const passwd = req.body.passwd;
    const result = await web3.eth.personal.newAccount(passwd);
    res.json({ result });
  } catch(err) {
    res.status(500).json({errer: "Internal Server Error"})
  }
});

app.use('/api', router);

app.listen(port);
