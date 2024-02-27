"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "../types";
import { addMenuGo, updateMenuGo } from "../api";
import {useRouter, useSearchParams} from "next/navigation";

interface MenuProps {
  fetchedMenu: Menu;
}

export default function UpdatePage({ fetchedMenu }: MenuProps) {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const owner = searchParams.get('name') ?? ''
  const [updatedMenu, setUpdatedMenu] = useState<Menu>(fetchedMenu); // Renamed setMenu to setUpdatedMenu for clarity

  
  const saveMenu = async (menuToSave: Menu) => {
    if (menuToSave.id === 0) {
      await addMenuGo(menuToSave);
    } else {
      await updateMenuGo(menuToSave);
    }
    // Re-fetch menu or update state as needed
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Ensure you're updating the state based on the previous state to avoid issues with stale state
        setUpdatedMenu(prevMenu => ({ ...prevMenu, picture: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Check for updatedMenu instead of menu
  if (!updatedMenu) return null; // Or some loading indicator


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
              <button onClick={onMenu} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
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

        <div className="flex justify-center items-center w-full my-20">
          
          {/* <div className="block max-w-sm p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4"> */}
          <div className="flex bg-pearlwhite rounded-3xl shadow-lg m-4">

            {/* Image preview and file input container */}
        <div className="flex flex-col justify-center items-center pt-20 pb-20 pl-10">
          {
            updatedMenu.picture ? (
              <img 
                src={updatedMenu.picture.includes('data:image') ? updatedMenu.picture : `data:image/jpeg;base64,${updatedMenu.picture}`}
                alt="Uploaded Menu"
                style={{ maxWidth: '85%', maxHeight: '280px' }}
              />
            ) : null
          }
          
          <div className="pt-10">
            <label 
              className="w-full text-center bg-spgreen text-white py-2.5 px-5 rounded-lg cursor-pointer hover:bg-green-600"
            >
              Upload Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </label>
          </div>
        </div>
            
            {/* Form container */}
            <div className="block w-3/5 p-10 min-h-64">
            <form className="space-y-4 md:space-y-7 " action="#">
            <div className="grid gap-6 mb-6 md:grid-cols-2 pt-10">
              <div>
                <input
                  className="bg-gray-50 outline outline-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="name"
                  type="text"
                  onChange={(e) => setUpdatedMenu({...updatedMenu, name: e.target.value})}
                  // placeholder={updatedMenu.name}
                  placeholder={"Name: " + String(updatedMenu.name)}
                />
              </div>
              <div>
              {/* <label htmlFor="meal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label> */}
              <select 
                className="h-10 w-full rounded border-r-8 border-transparent px-4 text-sm bg-gray-50 outline outline-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen "
                id="meal"
                onChange={(e) => setUpdatedMenu({...updatedMenu, meal: e.target.value})}
                >
                <option selected>Meal</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
              </div>
              </div>
              <div>
                <input
                  className="bg-gray-50 outline outline-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="detail"
                  type="text"
                  onChange={(e) => setUpdatedMenu({...updatedMenu, detail: e.target.value})}
                  // placeholder={updatedMenu.detail}
                  placeholder={"Detail: " + String(updatedMenu.detail)}
                />
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <input
                  className="bg-gray-50 outline outline-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="stock"
                  type="text"
                  onChange={(e) => setUpdatedMenu({...updatedMenu, stock: Number(e.target.value)})}
                  placeholder={"Stock: " + String(updatedMenu.stock)}
                />
              </div>
              <div>
                <input
                  className="bg-gray-50 outline outline-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen"
                  id="price"
                  type="text"
                  onChange={(e) => setUpdatedMenu({...updatedMenu, price: Number(e.target.value)})}
                  placeholder={"Price: " + String(updatedMenu.price)}
                />
              </div>
              </div>
              
              <div className="flex justify-end pt-20 pl-80" >
                <button
                  onClick={() => saveMenu(updatedMenu)}
                  className="w-full text-white bg-spgreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-green-600 focus:outline-none"
                >
                  Update
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}


