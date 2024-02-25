"use client";
import React, { useEffect, useState } from "react";
import { Menu } from "../types";
import UpdatePage from "./update";
import { getAllMenusGo } from "../api";

export default function Page() {
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

  return (
    <div>
      {menu && <UpdatePage fetchedMenu={menu} />}
    </div>
  );
}