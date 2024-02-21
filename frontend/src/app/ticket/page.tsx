"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from 'next/image';
import { genSaltSync, hashSync } from "bcrypt-ts";
import { userValidate } from "../api";

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

            <div className="flex justify-center items-center w-full my-20">
                <div className="block max-w-sm p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4">
                    {/* edit here */}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                    {/* ------------- */}
                </div>
            </div>
            </body>
            </html>
    
    )

}

