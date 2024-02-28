"use client";
import Link from "next/link";
import React from "react";
import {useRouter} from "next/navigation";

export default function uiPage() {
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

      const router = useRouter();
      const onToLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        router.push(`/`); 
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
                <a href="/food" className="font-serif text-spgreen text-4xl">Shokudo Online Ticket</a>
                <div className="flex items-center">
                    <a href="/designui" className="text-black text-sm py-2 px-10 rounded-lg mr-2">My profile</a>
                    <button onClick={onToLogin} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none">
                        <Link href="/">Login</Link>
                    </button>
                </div>  
            </div>
            </nav>
            <div className="container mx-auto flex justify-between items-end py-6">
                {/* edit here */}
                <h1 className="font-serif text-6xl text-black">Welcome</h1>
                {/* ------------- */}
                <span className="font-sans text-3xl text-black">
                    <strong className="font-bold">{meal}</strong>  —  {date}
                </span>
            </div>
            <div className="container mx-auto">
            <hr className="border-t-2 border-gray-300 my-4 " />
            </div>

            <div className="flex justify-center items-center w-full my-20">
                <div className="block w-1/4 p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4">
                    {/* edit here */}
                    <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 ">PBL Project 2024</h1>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900 ">Software Design Laboratory</h2>
                      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside ">
                          <li>
                              Papon Choonhaklai
                          </li>
                          <li>
                              Miki Yonekura
                          </li>
                      </ul>
                      <h2 className="mb-4 mt-4 text-2xl font-semibold text-gray-900 ">Software Engineering Laboratory</h2>
                      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside ">
                          <li>
                              Haruto Tanaka
                          </li>
                          <li>
                              Indira Febriyanti
                          </li>
                      </ul>

                    {/* ------------- */}
                </div>
            </div>
            </body>
            </html>
    
    )

}

