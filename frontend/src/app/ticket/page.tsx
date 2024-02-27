"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { getAllMenusGo, getTicketGo, getTicketGoAdmin} from "../api";
import TicketShowUser from "./components/TicketShowUser";
import TicketShowAdmin from "./components/TicketShowAdmin";
import { Menu, Ticket } from "../types";

export default function uiPage() {
    const searchParams = useSearchParams()
    const role = searchParams.get('role')
    const owner = searchParams.get('name') ?? ''
    const [menus, setMenus] = useState<Menu[]>([])
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [adminTickets, setAdminTickets] = useState<Ticket[]>([])

    const fetchTickets = async () => {
      const fetchedTickets = await getTicketGo(owner);
      setTickets(fetchedTickets);
    };

    const fetchAdminTickets = async () => {
      const fetchedAdminTickets = await getTicketGoAdmin();
      setAdminTickets(fetchedAdminTickets);
    };

    const getCurrentDate = () => {
        const dateOptions: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return new Date().toLocaleDateString('en-US', dateOptions);
      };
      
    
      // Function to determine the current meal based on the hour of the day
      const getCurrentMeal = () => {
        const hours = new Date().getHours();
        if (hours < 10) {
          return 'Breakfast';
        } else if (hours < 16) {
          return 'Lunch';
        } else {
          return 'Dinner';
        }
      };
    
      // Get the current meal and date
      const meal = getCurrentMeal();
      const date = getCurrentDate();
      

     const fetchMenu = async () => {
      const fetchedMenu = await getAllMenusGo()
      setMenus(fetchedMenu)
  }

      useEffect(() => {
          fetchMenu();
          fetchTickets();
          fetchAdminTickets();
      },[])

      const router = useRouter();
      const onMenu = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        if (role == "true") {
            router.push(`/food?role=${role}&name=${owner}`);
            // router.push(`/food?role=${result.role}&email=${user.email}&name=${result.name}`);
        } else {
            router.push(`/food?&name=${owner}`);
            // alert('Username and password do not match')
        }
      }

    return (
            <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shokudo Online Ticket</title>
            </head>
            <body>
            
            <nav className="p-10">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="font-serif text-spgreen text-4xl">Shokudo Online Ticket</a>
                <div className="flex items-center">
                    <a href="/designui" className="text-black text-sm py-2 px-10 rounded-lg mr-2">My profile</a>
                    <button onClick={onMenu} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none">
                        <Link href="/food" >Menu</Link>
                    </button>
                </div>  
            </div>
            </nav>
            <div className="container mx-auto flex justify-between items-end py-6">
                {/* edit here */}
                <div className="flex items-baseline">
                  <h1 className="font-serif text-6xl text-black">
                    {role === 'true' ? 'Confirm Ticket' : 'Ticket'}
                  </h1>
                  <p className="text-3xl ml-4">
                    {"Items: " + (role === 'true' ? adminTickets?.length ?? 0 : tickets?.length ?? 0)}
                  </p>
                </div>

                {/* ------------- */}
                <span className="font-sans text-3xl text-black">
                    <strong className="font-bold">{meal}</strong>  —  {date}
                </span>
            </div>
            <div className="container mx-auto">
            <hr className="border-t-2 border-gray-300 my-4 " />
            </div>

            <div className="container mx-auto flex ">
              <div className="block  min-h-64  w-1/2 rounded-3xl ">             
                    <div>
                      <div>
                        {
                          role == 'true' ? <TicketShowAdmin onTicketsUpdate={fetchAdminTickets} /> : <TicketShowUser onTicketsUpdate={fetchTickets} owner={owner} />
                        }
                      </div>
                  </div>
                  
                  
                </div>
                {/* New block to be placed on the right */}
                <div className="block min-h-64 w-1/4 h-80 rounded-3xl shadow-lg bg-pearlwhite ml-auto mt-10 mr-36 flex justify-center items-center">
                  {/* Content of the second block */}
                  {
                    menus.map(menu => (
                      <div key={menu.id} className='text-center'>
                        <span className="text-3xl font-semibold">Stock Left</span>
                        <div className="text-9xl font-normal my-4">{menu.stock}</div>
                      </div>
                    ))
                  }
                </div>
            </div>
            </body>
            </html>
    
    )

}

