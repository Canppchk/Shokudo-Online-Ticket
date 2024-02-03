import { Menu } from "./types";


export const getAllMenus = async (): Promise<Menu[]> => {
    const res = await fetch('http://localhost:3001/menus',{
        cache: 'no-store' //SSR
    })
    const menus = res.json()

    return menus;
}