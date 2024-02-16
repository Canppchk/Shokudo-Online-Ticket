'use client'

import { useEffect, useState } from "react";
import { getAllMenusGo } from "./api";
import Header from "./components/Header";
import MenuList from "./components/MenuList";
import { Menu } from "./types";

export default function Home() {
    //TODO:temporarily use json-server (npm run json-server)
    //TODO:if we will add function that update datas, chidelen component has to have this method?
    const [menus, setMenus] = useState<Menu[]>([])
    const fetchMenus = async () => {
        const fetchedMenus = await getAllMenusGo()
        setMenus(fetchedMenus)
    }

    useEffect(() => {
        fetchMenus();

    },[])


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
                    </div>
                </div>
            </div>
        </div>
    )
}
