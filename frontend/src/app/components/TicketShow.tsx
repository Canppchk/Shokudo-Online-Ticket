import React from 'react'
import { Ticket } from '../types'

interface TicketProps {
  tickets: Ticket[];
}

const TicketShow = ({ tickets }: TicketProps) => {
  // Assuming you want to count all tickets as the stock left
  const stockLeft = tickets.length;

  return (
    <div className="flex flex-col items-center">
      <div className="m-3 w-full">
            {tickets.map((ticket) => (
        <div key={ticket.id} className="m-8 p-3 rounded-3xl bg-pearlwhite shadow-lg w-full relative">
          <div className="flex items-center">
            <img src="/Ticket-icon.png" alt="Ticket Icon" className="h-40 w-40 mr-4" /> {/* Adjust the path to your ticket icon */}
            <div>
              <div className="font-bold">Ticket ID: {ticket.id}</div>
              <div>Status: {ticket.status}</div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="bg-spgreen text-white rounded-lg px-4 py-2 hover:bg-green-600">
              Confirm
            </button>
          </div>
        </div>
      ))}

      </div>
      <div className="m-3 p-3 rounded bg-pearlwhite shadow-md w-48 text-center">
        <div className="font-bold">Stock Left</div>
        <div className="text-4xl">{stockLeft}</div>
      </div>
    </div>
  );
};

export default TicketShow;
