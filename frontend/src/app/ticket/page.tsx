"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from 'next/image';
import { genSaltSync, hashSync } from "bcrypt-ts";
import { getTicketGo, userValidate } from "../api";
import TicketShowUser from "../components/TicketShowUser";
import { Ticket } from "../types";
import TicketShowAdmin from "../components/TicketShowAdmin";

export default function uiPage() {
    const searchParams = useSearchParams()
    const role = searchParams.get('role')

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


      const [tickets, setTickets] = useState<Ticket[]>([])
      const fetchMenus = async () => {
          const fetchedMenus = await getTicketGo()
          setTickets(fetchedMenus)
      }

      useEffect(() => {
          fetchMenus();

      },[])

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
                    <button className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
                        <Link href="/">Menu</Link>
                    </button>
                </div>  
            </div>
            </nav>
            <div className="container mx-auto flex justify-between items-end py-6">
                {/* edit here */}
                <h1 className="font-serif text-6xl text-black">Ticket</h1>
                {/* ------------- */}
                <span className="font-sans text-3xl text-black">
                    <strong className="font-bold">{meal}</strong>  —  {date}
                </span>
            </div>
            <div className="container mx-auto">
            <hr className="border-t-2 border-gray-300 my-4 " />
            </div>

            <div className="container mx-auto ">
                <div>
                      {
                        role == 'true' ? <TicketShowAdmin adminTickets={adminTickets} /> : <TicketShowUser tickets={tickets} />
                      }
                </div>
                <div className="w-1/3"></div>
            </div>
            </body>
            </html>
    
    )

}

