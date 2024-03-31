// SPDX-License-Identifier: ISC
pragma solidity ^0.8.17;

contract TicketSale {
    uint public revenue;
    string public ownerName;
    address public owner;
    uint public ticketPrice; // Added ticket price variable

    struct Ticket {
        uint ticketId;
        address ownerAddress;
    }

    mapping(uint => Ticket) public ticketOwners;
    mapping(address => uint) public addressToTicket;
    mapping(address => address) public swapOffers;

    constructor(string memory _ownerName, uint _ticketPrice) {
        ownerName = _ownerName;
        owner = msg.sender;
        ticketPrice = _ticketPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function buyTicket(uint ticketId) public payable {
        require(ticketId > 0, "Invalid ticketId");
        require(ticketOwners[ticketId].ownerAddress == address(0), "Ticket already sold");
        require(msg.value == ticketPrice, "Incorrect payment amount");

        ticketOwners[ticketId] = Ticket(ticketId, msg.sender);
        addressToTicket[msg.sender] = ticketId;
        revenue += msg.value;
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
        require(ticketOwners[ticketId].ownerAddress == msg.sender, "You don't own this ticket");
        ticketOwners[ticketId] = Ticket(ticketId, address(0));
        addressToTicket[msg.sender] = 0;

        uint refundAmount = (ticketPrice * 9) / 10;
        (bool success, ) = owner.call{value: refundAmount}("");
        require(success, "Refund failed");

        revenue -= refundAmount;
    }

    function getRevenue() public view returns (uint) {
        return revenue;
    }
}
