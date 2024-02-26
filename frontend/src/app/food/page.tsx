"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { getAllMenusGo, userValidate } from "../api";
import { Menu } from "../types";
import FoodAdmin from "./components/FoodAdmin";
import FoodUser from "./components/FoodUser";
import { useSearchParams } from "next/navigation";

export default function uiPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  console.log(role)

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

      const [menus, setMenus] = useState<Menu[]>([])
      const fetchMenus = async () => {
          const fetchedMenus = await getAllMenusGo()
          setMenus(fetchedMenus)
          
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
                        <Link href="/ticket">Ticket</Link>
                    </button>
                </div>  
            </div>
            </nav>
            <div className="container mx-auto flex justify-between items-end py-6">
                {/* edit here */}
                <h1 className="font-serif text-6xl text-black">Food set</h1>
                {/* ------------- */}
                <span className="font-sans text-3xl text-black">
                    <strong className="font-bold">{meal}</strong>  —  {date}
                </span>
            </div>
            <div className="container mx-auto">
            <hr className="border-t-2 border-gray-300 my-4 " />
            </div>

            {
              role == 'true' ? <FoodAdmin menus={menus}/> : <FoodUser menus={menus}/>
            }

            </body>
            </html>
    
    )

}

