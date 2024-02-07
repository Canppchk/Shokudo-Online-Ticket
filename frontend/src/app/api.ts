import { Menu } from "./types";


export const getAllMenusGo = async (): Promise<Menu[]> => {
    const res = await fetch('http://localhost:3001/menus',{
        cache: 'no-store' //SSR
    })
    const menus = res.json()

    return menus;
}

export const addMenuGo = async (menu: Menu) => {
    const res = await fetch('http://localhost:3001/menus',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(menu)
    })
}

export const deleteMenuGo = async (menuId: string) => {
    const res = await fetch(`http://localhost:3001/menus/${menuId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        // 削除が成功した場合の処理
    } else {
        // 削除が失敗した場合のエラーハンドリング
        console.error("Failed to delete menu");
    }
}
