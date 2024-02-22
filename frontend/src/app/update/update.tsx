"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "../types";

interface MenuProps {
  fetchedMenu: Menu;
}

export default function UpdatePage({ fetchedMenu }: MenuProps) {
  const [updatedMenu, setMenu] = useState(fetchedMenu);

  const getCurrentDate = () => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", dateOptions);
  };

  // Function to determine the current meal based on the hour of the day
  const getCurrentMeal = () => {
    const hours = new Date().getHours();
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
              <button className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
                <Link href="/ticket">Ticket</Link>
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

        <div className="flex justify-center items-center w-full my-20">
          <div className="block max-w-sm p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4">
            <form className="space-y-4 md:space-y-7 " action="#">
              <div>
                <input
                  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="username"
                  type="text"
                  value={updatedMenu.name}
                  onChange={(e) => setMenu({...updatedMenu, name: e.target.value})}
                  placeholder={updatedMenu.name}
                />
              </div>
              <div>
                <input
                  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="username"
                  type="text"
                  value={updatedMenu.detail}
                  onChange={(e) => setMenu({...updatedMenu, detail: e.target.value})}
                  placeholder={updatedMenu.detail}
                />
              </div>
              <div>
                <input
                  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="username"
                  type="text"
                  onChange={(e) => setMenu({...updatedMenu, stock: Number(e.target.value)})}
                  placeholder={"Stock: " + String(updatedMenu.stock)}
                />
              </div>
              <div>
                <input
                  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="username"
                  type="text"
                  onChange={(e) => setMenu({...updatedMenu, stock: Number(e.target.value)})}
                  placeholder={"Price: " + String(updatedMenu.price)}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <button
                  // onClick={onSignup}
                  className="w-full text-white bg-spgreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-green-600 focus:outline-none"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
}
