'use client'

import { useEffect, useState } from "react";
import { getAllMenus } from "../api";
import Counter from "./components/Counter";
import MenuManagement from "./components/MenuManagement";
import { Menu } from "../types";

export default function Home() {
    const [menus, setMenus] = useState<Menu[]>([])

    useEffect(() => {
        const fetchMenus = async () => {
            const fetchedMenus = await getAllMenus()
            setMenus(fetchedMenus)
        }
        fetchMenus();
    },[])
    

    return (
        <div className="m-5 flex flex-col items-center space-y-3">
            <Counter />
            <MenuManagement menus={menus} setMenus={setMenus}/>
        </div>
    )
}
