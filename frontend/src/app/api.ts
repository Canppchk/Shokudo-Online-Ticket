import { Menu } from "./types";


export const getAllMenus = async (): Promise<Menu[]> => {
    const res = await fetch('http://localhost:3001/menus',{
        cache: 'no-store' //SSR
    })
    const menus = res.json()

    return menus;
}

export const addMenu = async (menu: Menu): Promise<Menu[]> => {
    const res = await fetch('http://localhost:3001/menus',{
        method: "POST",
        headers: {
            "Content-Type": "applocation/json",
        },
        body: JSON.stringify(menu)
    })
    const newMenus = res.json()

    return newMenus;
}