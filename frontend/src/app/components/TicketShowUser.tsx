import React from 'react'
import { Menu, Ticket } from '../types'
import { changeTicketStatus, updateMenuStock } from '../api'

interface TicketProps {
  tickets: Ticket[]
}

const TicketShowUser = ({tickets}:TicketProps) => {

  const toPending = (id: number) => {
    changeTicketStatus('Pending', id)

  }
  
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
                    <button onClick={() => toPending(ticket.id)} className="bg-spgreen text-white rounded-lg px-4 py-2 hover:bg-green-600">
                      Use
                    </button>
                  </div>
                </div>
              ))}

              </div>
            </div>
  )
}

export default TicketShowUser
