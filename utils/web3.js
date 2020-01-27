const Web3 = require('web3');
const ganache = require('ganache-cli');
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(
    'point verify supreme coach great helmet usage planet alert few bean visit',
    'https://rinkeby.infura.io/v3/a426a5fbdadc47bf8a9683933ab79a78'
);

let web3;
if(process.env.NODE_ENV === 'testing') web3 = new Web3(ganache.provider());
else web3 = new Web3(provider);

module.exports = web3;