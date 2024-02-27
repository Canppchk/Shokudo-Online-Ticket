'use client'

import { useEffect, useState } from "react";
import Counter from "./components/Counter";
import MenuManagement from "./components/MenuManagement";
import { Menu } from "../types";
import { addCartGo, addMenuGo, deleteMenuGo, getAllBasketGo, getAllMenusGo } from "../api";
import Basket from "./components/Basket";
import MenuListTest from "./components/MenuListTest";
import Header from "./components/Header";
import MenuList from "./components/MenuList";


export default function Home() {
    //TODO:temporarily use json-server (npm run json-server)
    //TODO:if we will add function that update datas, chidelen component has to have this method?
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
        <div>
            <Header />
            <div className="flex flex-col items-center"> 
                <div className="grid grid-cols-12 gap-4 w-full">
                    <div className="col-span-8">
                        <MenuList menus={menus}/>
                    </div>
                    <div className="col-span-4">
                        <div className="m-5 p-5 rounded bg-white shadow-md flex flex-wrap">
                            カートを表示
                        </div>
                        <div className="m-5 flex flex-col items-center space-y-3">
                        <Counter />
                        <div className="flex space-x-2">
                            <MenuManagement menus={menus} addMenu={addMenu} deleteMenu={deleteMenu}/>
                            <MenuListTest menus={menus} addCart={addCart}/>
                        </div>

                        <Basket basket={basket}/>
                    </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}
