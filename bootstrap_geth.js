if (eth.accounts.length == 0) {
  [1, 2, 3, 4].forEach(function () {
    personal.newAccount("super-secure-passwd");
  });
}

console.log(eth.accounts[0]);

miner.start();

eth.accounts.forEach(function (account) {
  personal.unlockAccount(account, "super-secure-passwd", 150000);
});

[1, 2, 3].forEach(function (v) {
  eth.sendTransaction({ from: eth.accounts[0], to: eth.accounts[v], value: 1000000000000000000 });
});

