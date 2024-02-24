const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'TicketSale.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: "Solidity",
  sources: {
    "TicketSale.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};

for (let contractName in output.contracts["TicketSale.sol"]) {
    const contract = output.contracts["TicketSale.sol"][contractName];
    
    // Output ABI to console
    console.log("ABI:", JSON.stringify(contract.abi));

    // Output bytecode to console
    console.log("Bytecode:", contract.evm.bytecode.object);

    // Write ABI to file
    const abiPath = path.resolve(__dirname, 'TicketSaleAbi.json');
    fs.writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2));

    // Write bytecode to file
    const bytecodePath = path.resolve(__dirname, 'TicketSaleBytecode.json');
    fs.writeFileSync(bytecodePath, contract.evm.bytecode.object);
}
