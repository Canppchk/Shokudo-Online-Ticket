"use client";
import React, { useEffect, useState } from "react";
import { Menu } from "../types";
import UpdatePage from "./update";
import { getAllMenusGo } from "../api";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const owner = searchParams.get('name') ?? ''
  const [menu, setMenu] = useState<Menu | null>(null); // State for a single Menu object

  useEffect(() => {
    const fetchMenu = async () => {
      const fetchedMenus = await getAllMenusGo(); // Fetching an array of Menu objects
      if (fetchedMenus.length > 0) {
        setMenu(fetchedMenus[0]); // Assuming you want the first Menu object
      } else {
        setMenu(null); // Set to null if no menus are fetched
      }
    };

    fetchMenu();
  }, []); // Effect runs once on mount

  const getCurrentDate = () => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Tokyo"
    };
    return new Date().toLocaleDateString("en-US", dateOptions);
  };

  // Function to determine the current meal based on the hour of the day
  const getCurrentMeal = () => {
  // Create a new date object for the current time in Tokyo
  const now = new Date();
  const tokyoTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + (9 * 3600000)); // Add 9 hours to UTC time

  // Use the hours from the adjusted Tokyo time
  const hours = tokyoTime.getHours();

  if (hours < 10) {
    return "Breakfast";
  } else if (hours < 16) {
    return "Lunch";
  } else {
    return "Dinner";
  }
};

  // Get the current meal and date
  const meal = getCurrentMeal();
  const date = getCurrentDate();

  const router = useRouter();
      const onMenu = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        router.push(`/food?role=true&name=${owner}`);
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
            <a href="#" className="font-serif text-spgreen text-4xl">
              Shokudo Online Ticket
            </a>
            <div className="flex items-center">
              <a
                href="/designui"
                className="text-black text-sm py-2 px-10 rounded-lg mr-2"
              >
                My profile
              </a>
              <button onClick={onMenu} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none">
                        <Link href="/food" >Menu</Link>
              </button>
            </div>
          </div>
        </nav>
        <div className="container mx-auto flex justify-between items-end py-6">
          {/* edit here */}
          <h1 className="font-serif text-6xl text-black">Update Menu</h1>
          {/* ------------- */}
          <span className="font-sans text-3xl text-black">
            <strong className="font-bold">{meal}</strong> — {date}
          </span>
        </div>
        <div className="container mx-auto">
          <hr className="border-t-2 border-gray-300 my-4 " />
        </div>
    <div>
      {menu && <UpdatePage fetchedMenu={menu} />}
    </div>
  </body>
</html>
  );
}
