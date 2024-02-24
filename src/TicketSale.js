import Web3 from 'web3';

const contractAddress = 'ADDRESS';
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_numTickets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ticketId",
        "type": "uint256"
      }
    ],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "partner",
        "type": "address"
      }
    ],
    "name": "offerSwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "partner",
        "type": "address"
      }
    ],
    "name": "acceptSwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ticketId",
        "type": "uint256"
      }
    ],
    "name": "returnTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "person",
        "type": "address"
      }
    ],
    "name": "getTicketOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Use Infura or local provider
const contract = new web3.eth.Contract(contractABI, contractAddress);

export async function buyTicket(ticketId) {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.buyTicket(ticketId).send({ from: accounts[0], value: contract.methods.ticketPrice().call() });
    return { success: true, message: 'Ticket purchased successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function offerSwap(partner) {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.offerSwap(partner).send({ from: accounts[0] });
    return { success: true, message: 'Swap offer sent successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function acceptSwap(partner) {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.acceptSwap(partner).send({ from: accounts[0] });
    return { success: true, message: 'Swap accepted successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getTicketNumber() {
  try {
    const accounts = await web3.eth.getAccounts();
    const ticketNumber = await contract.methods.getTicketOf(accounts[0]).call();
    return { success: true, ticketNumber: ticketNumber };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function returnTicket(ticketId) {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.returnTicket(ticketId).send({ from: accounts[0] });
    return { success: true, message: 'Ticket returned successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
