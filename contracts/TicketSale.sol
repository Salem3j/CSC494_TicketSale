// SPDX-License-Identifier: ISC
pragma solidity ^0.8.17;

contract TicketSale {
    address public owner;
    uint public numTickets;
    uint public ticketPrice;
    mapping(uint => address) public ticketOwners;
    mapping(address => uint) public addressToTicket;
    mapping(address => address) public swapOffers;

    constructor(uint _numTickets, uint _price) {
        owner = msg.sender;
        numTickets = _numTickets;
        ticketPrice = _price;
    }

    function buyTicket(uint ticketId) public payable {
        require(msg.sender != owner, "Owner cannot buy tickets");
        require(ticketId > 0 && ticketId <= numTickets, "Invalid ticketId");
        require(ticketOwners[ticketId] == address(0), "Ticket already sold");
        require(addressToTicket[msg.sender] == 0, "You already have a ticket");
        require(msg.value == ticketPrice, "Incorrect payment amount");

        ticketOwners[ticketId] = msg.sender;
        addressToTicket[msg.sender] = ticketId;
    }

    function getTicketOf(address person) public view returns (uint) {
        return addressToTicket[person];
    }

    function offerSwap(address partner) public {
        require(addressToTicket[msg.sender] > 0, "You must own a ticket to offer a swap");
        require(partner != msg.sender, "You cannot swap with yourself");
        swapOffers[msg.sender] = partner;
    }

    function acceptSwap(address partner) public {
        require(addressToTicket[msg.sender] > 0, "You must own a ticket to accept a swap");
        address requester = msg.sender;
        require(swapOffers[partner] == requester, "No valid swap offer from partner");

        uint requesterTicket = addressToTicket[requester];
        uint partnerTicket = addressToTicket[partner];

        addressToTicket[requester] = partnerTicket;
        addressToTicket[partner] = requesterTicket;

        delete swapOffers[partner];
    }

    function returnTicket(uint ticketId) public {
        require(ticketOwners[ticketId] == msg.sender, "You don't own this ticket");
        ticketOwners[ticketId] = address(0);
        addressToTicket[msg.sender] = 0;

        // Calculate the refund after a 10% service fee
        uint refundAmount = (ticketPrice * 9) / 10;
        (bool success, ) = owner.call{value: refundAmount}("");
        require(success, "Refund failed");
    }
}
