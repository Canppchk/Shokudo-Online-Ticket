'use client'

import { useEffect, useState } from "react";
import Counter from "./components/Counter";
import MenuManagement from "./components/MenuManagement";
import { Menu } from "../types";
import { addMenuGo, deleteMenuGo, getAllMenusGo } from "../api";

export default function Home() {
    const [menus, setMenus] = useState<Menu[]>([])

    const fetchMenus = async () => {
        const fetchedMenus = await getAllMenusGo()
        setMenus(fetchedMenus)
    }

    useEffect(() => {
        fetchMenus();
    },[])

    const addMenu = async (additionalMenu:Menu) => {
        addMenuGo(additionalMenu)
        fetchMenus();
    }

    const deleteMenu = (menuId: string) => {
        deleteMenuGo(menuId)
        fetchMenus();
    }

    return (
        <div className="m-5 flex flex-col items-center space-y-3">
            <Counter />
            <MenuManagement menus={menus} addMenu={addMenu} deleteMenu={deleteMenu}/>
        </div>
    )
}
