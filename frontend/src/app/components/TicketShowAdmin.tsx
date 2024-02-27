import React, { useEffect, useState } from 'react'
import { Ticket } from '../types'
import { changeTicketStatus, getTicketGoAdmin} from '../api'

const TicketShowAdmin = () => {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  const fetchTickets = async () => {
    const fetchedTickets = await getTicketGoAdmin();
    setTickets(fetchedTickets);
  };

  useEffect(() => {
    fetchTickets();
  }, []); // Empty dependency array to fetch tickets only on mount

  const toAccepted = async (id: number) => {
    await changeTicketStatus('Accepted', id);
    fetchTickets(); // Fetch tickets again to update the list
  }

  if (!tickets) return null;

  return (
      <div className="flex flex-col items-center">
      <div className="m-3 w-full">
            {tickets.map((ticket) => (
        <div key={ticket.id} className="m-8 p-3 rounded-3xl bg-pearlwhite shadow-lg w-full relative">
          <div className="flex items-center">
                  <div className="flex items-start"> {/* Align items to the start (top) */}
                    <img src="/Ticket-icon.png" alt="Ticket Icon" className="h-40 w-40 mr-4" />
                    <div className="pl-5 pt-5">
                      <div className="font-medium text-xl">Ticket ID: {ticket.id}</div>
                      <div className="font-medium text-xl text-spgreen">Status: {ticket.status}</div>
                    </div>
                  </div>
                  </div>
          <div className="absolute bottom-4 right-4 pb-2.5 pr-5">
            <button  onClick={() => toAccepted(ticket.id)} className="bg-spgreen text-white rounded-lg px-8 py-2 hover:bg-green-600">
              Confirm
            </button>
          </div>
        </div>
      ))}

      </div>
      </div>
  )
}

export default TicketShowAdmin
