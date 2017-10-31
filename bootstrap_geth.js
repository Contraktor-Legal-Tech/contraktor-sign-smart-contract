// Create four accounts
if (eth.accounts.length == 0) {
  [1, 2, 3, 4].forEach(function () {
    personal.newAccount("super-secure-passwd");
  });
}

miner.setEtherbase(eth.accounts[0]);

console.log("Coinbase:", eth.accounts[0]);

// One theead should be ok for private mining
var mining_threads = 1

// Cool trick to mining only when transactions are available
function checkWork() {
  if (eth.pendingTransactions.length > 0) {
    if (eth.mining) return;
    console.log("== Pending transactions! Mining...");
    miner.start(mining_threads);
  } else {
    miner.stop();
    console.log("== No transactions! Mining stopped.");
  }
}

// Part of the trick
eth.filter("latest", function (err, block) { checkWork(); });
eth.filter("pending", function (err, block) { checkWork(); });

miner.start(mining_threads);

// Unlock our accounts forever
// NEVER EVER DO THAT IN PROD
eth.accounts.forEach(function (account) {
  personal.unlockAccount(account, "super-secure-passwd", 0);
});

// Sending some ether to ours good friends
[1, 2, 3].forEach(function (v) {
  eth.sendTransaction({ from: eth.accounts[0], to: eth.accounts[v], value: web3.toWei(1) });
});

// Checking
checkWork();
