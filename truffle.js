module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: "4", // Match any network id
      from: '0x60a39262d3375855EfF4B5238b4C4FD59f1Ce163'
    }
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
