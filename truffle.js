module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost",
      port: 8546,
      network_id: "4" // Match any network id
    }
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
