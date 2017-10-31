module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      from: '0xcddb4addbd8198cecb0e152b45ee8addb790e5b8',
      gas: '4000000'
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: "4", // Match any network id
      from: '0x7D99AF1F5b61CeD2b39dd6dCa37752fbd074dc74',
      gas: '4000000'
    }
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
