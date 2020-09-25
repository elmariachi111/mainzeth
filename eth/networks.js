module.exports = {
  networks: {
    ganache: {
      protocol: 'http',
      host: 'localhost',
      port: 7545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    geth: {
      protocol: 'http',
      host: 'localhost',
      port: 7546,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
  },
};
