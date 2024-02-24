const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require('../compile');

let accounts;
let ticketSale;
let ticketID;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    ticketSale = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [10, 100] })
        .send({ from: accounts[0], gasPrice: '1000000000', gas: 2000000 });
    ticketID = 0;
});

describe('TicketSale test', () => {
    it('deploy TicketSale contract', () => {
        assert.ok(ticketSale.options.address);
    });

    it('buyTicket function', async () => {
        const initialTicketOwner = await ticketSale.methods.getTicketOf(accounts[0]).call();
        assert.strictEqual(initialTicketOwner, "0", "Initial ticket ownership not as expected");

        await ticketSale.methods.buyTicket(ticketID).send({ from: accounts[1], value: 100 });
        const newTicketOwner = await ticketSale.methods.getTicketOf(accounts[1]).call();
        assert.strictEqual(newTicketOwner, "1", "Ticket ownership not updated after purchase");
    });

    it('offerSwap function', async () => {
        await ticketSale.methods.buyTicket(ticketID).send({ from: accounts[1], value: 100 });
        await ticketSale.methods.offerSwap(accounts[2]).send({ from: accounts[1] });

        const swapOffer = await ticketSale.methods.swapOffers(accounts[1]).call();
        assert.strictEqual(swapOffer, accounts[2], "Swap offer not registered correctly");
    });

    it('acceptSwap function', async () => {
        await ticketSale.methods.buyTicket(ticketID).send({ from: accounts[1], value: 100 });
        await ticketSale.methods.offerSwap(accounts[2]).send({ from: accounts[1] });

        await ticketSale.methods.acceptSwap(accounts[1]).send({ from: accounts[2] });
        const newOwner = await ticketSale.methods.getTicketOf(accounts[2]).call();
        assert.strictEqual(newOwner, "0", "Ticket ownership not updated after swap");
    });

    it('returnTicket function', async () => {
        await ticketSale.methods.buyTicket(ticketID).send({ from: accounts[1], value: 100 });
        const initialBalance = await web3.eth.getBalance(accounts[1]);

        await ticketSale.methods.returnTicket(ticketID).send({ from: accounts[1] });
        const newBalance = await web3.eth.getBalance(accounts[1]);

        assert.strictEqual(newBalance - initialBalance > 90, true, "Refund amount incorrect");
    });
});
