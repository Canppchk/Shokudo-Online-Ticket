'use client'

import { useEffect, useState } from "react";
import Counter from "./components/Counter";
import MenuManagement from "./components/MenuManagement";
import { Menu } from "../types";
import { addCartGo, addMenuGo, deleteMenuGo, getAllBasketGo, getAllMenusGo } from "../api";
import Basket from "./components/Basket";
import MenuListTest from "./components/MenuListTest";

export default function Home() {
    const [menus, setMenus] = useState<Menu[]>([])
    const [basket, setBasket] = useState<Menu[]>([])
 
    const fetchMenus = async () => {
        const fetchedMenus = await getAllMenusGo()
        setMenus(fetchedMenus)
    }
    const fetchBasket = async () => {
        const fetchedBasket = await getAllBasketGo()
        setBasket(fetchedBasket)
    }

    useEffect(() => {
        fetchMenus();
        fetchBasket();
    },[])

    const addMenu = async (additionalMenu:Menu) => {
        addMenuGo(additionalMenu)
        fetchMenus();
    }

    const addCart = async (additionalMenu:Menu) => {
        addCartGo(additionalMenu)
        fetchBasket();
    }

    const deleteMenu = (menuId: number) => {
        deleteMenuGo(menuId)
        fetchMenus();
    }

    return (
        <div className="m-5 flex flex-col items-center space-y-3">
            <Counter />
            <div className="flex space-x-2">
                <MenuManagement menus={menus} addMenu={addMenu} deleteMenu={deleteMenu}/>
                <MenuListTest menus={menus} addCart={addCart}/>
            </div>

            <Basket basket={basket}/>
        </div>
    )
}
