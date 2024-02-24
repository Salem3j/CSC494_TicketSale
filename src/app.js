import { buyTicket, offerSwap, acceptSwap, getTicketNumber, returnTicket } from './TicketSale';

async function buyTicket() {
  const ticketId = document.getElementById("ticketId").value;
  const { success, message } = await buyTicket(ticketId);
  showMessage(success, message);
}

async function offerSwap() {
  const partner = document.getElementById("swapPartner").value;
  const { success, message } = await offerSwap(partner);
  showMessage(success, message);
}

async function acceptSwap() {
  const partner = document.getElementById("acceptPartner").value;
  const { success, message } = await acceptSwap(partner);
  showMessage(success, message);
}

async function getTicketNumber() {
  const { success, ticketNumber, message } = await getTicketNumber();
  if (success) {
    document.getElementById("message").innerHTML = `Your ticket number is: ${ticketNumber}`;
  } else {
    showMessage(success, message);
  }
}

async function returnTicket() {
  const ticketId = document.getElementById("returnTicketId").value;
  const { success, message } = await returnTicket(ticketId);
  showMessage(success, message);
}

function showMessage(success, message) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = message;
  if (success) {
    messageDiv.style.color = "green";
  } else {
    messageDiv.style.color = "red";
  }
}
