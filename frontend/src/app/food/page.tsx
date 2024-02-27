"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { getAllMenusGo, userValidate } from "../api";
import { Menu } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import PayButton from "../components/PayButton";

export default function uiPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  // const name = searchParams.get('name') 
  const name = searchParams.get('name') ?? ''
  console.log(role,name)


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

      const router = useRouter()
      const handleTicketButtonClick = () => {
        router.push(`/ticket?name=${name}&role=${role}`);
      };
      const handleUpdateButtonClick = () => {
        router.push(`/update?name=${name}&role=${role}`);
      };
  
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
                <a href="/food" className="font-serif text-spgreen text-4xl">Shokudo Online Ticket</a>
                <div className="flex items-center">
                    <a href="/designui" className="text-black text-sm py-2 px-10 rounded-lg mr-2">My profile</a>
                    <button onClick={handleTicketButtonClick} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
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
            <div className="flex justify-center items-center w-full my-20">
              <div className="block max-w-sm p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4">
                  {/* edit here */}
                  {
                      menus.map(menu => (
                          <div key={menu.id} className='flex flex-col space-y-2'>
                              {/* <img src={`data:image/jpeg;base64,${menu.picture}`} alt="Menu Item" /> */}
                              <img src={menu.picture} alt="Menu Item" />
                              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{menu.name}</h5>
                              <p className="font-normal text-green-700 dark:text-green-400">{menu.price} Yen</p>
                              <p className="font-normal text-gray-700 dark:text-gray-400">{menu.detail}</p>
                              <div className='flex justify-between space-x-2'>
                                  <div>
                                      <p className="font-normal text-gray-700 dark:text-gray-400">stock left: {menu.stock}</p>
                                  </div>
                                  {
                                    role == 'true' ? 
                                    <div className="pt-5">
                                      <button onClick={handleUpdateButtonClick} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-5 rounded hover:bg-green-600 focus:outline-none">
                                          <Link href={`/update`}>Update</Link>
                                      </button>
                                    </div>
                                    : <PayButton name={name}></PayButton>
                                  }
                              </div>
                          </div>
                      ))
                  }
              </div>
          </div>

            

            </body>
            </html>
    
    )

}

