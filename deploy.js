const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'check pipe earn usual woman decorate deputy under mobile pride endorse jacket',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/8dcaac16dab14ab898f0ac8d34e56adb'
  // remember to change this to your own endpoint!
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  TicketSale = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});

  console.log('Contract deployed to', TicketSale.options.address);
  provider.engine.stop();
};
deploy();