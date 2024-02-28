"use client";
import React, { useState } from "react";
import { Menu } from "../types";
import { addMenuGo, updateMenuGo } from "../api";


interface MenuProps {
  fetchedMenu: Menu;
}

export default function UpdatePage({ fetchedMenu }: MenuProps) {
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
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        // Consider more aggressive scaling for further size reduction
        const MAX_WIDTH = 600;  // Reduced max width
        const MAX_HEIGHT = 450; // Reduced max height
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions, preserving aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fill the canvas with a white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Lower the quality to further reduce the file size
          const QUALITY = 0.7; // Adjust quality from 0 (worst) to 1 (best)
          const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);

          setUpdatedMenu((prevMenu) => ({ ...prevMenu, picture: dataUrl }));
        } else {
          console.error('Failed to get canvas context');
        }
      };
    };
    reader.readAsDataURL(file);
  }
};


  // Check for updatedMenu instead of menu
  if (!updatedMenu) return null; // Or some loading indicator

  return (
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
  );
}


