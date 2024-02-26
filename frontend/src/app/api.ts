import {Menu, Ticket, User} from "./types";

export const userValidate = async (user: User) => {
    const res = await fetch('http://localhost:10000/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user), // user オブジェクトを JSON に変換して body に設定
        cache: 'no-store'
    });
    const result = await res.json(); // JSON形式のレスポンスを解析
    return result;
};

export const userResister = async (user: User) => {
    const res = await fetch('http://localhost:10000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user), // user オブジェクトを JSON に変換して body に設定
        cache: 'no-store'
    });
    const result = await res.json(); // JSON形式のレスポンスを解析
    return result;
};


export const getAllMenusGo = async (): Promise<Menu[]> => {
    const res = await fetch('http://localhost:10000/food/now',{
        cache: 'no-store' //SSR
    })
    const menus = res.json()

    return menus;
}
export const getAllBasketGo = async (): Promise<Menu[]> => {
    const res = await fetch('http://localhost:3001/basket',{
        cache: 'no-store' //SSR
    })
    const basket = res.json()

    return basket;
}

export const addMenuGo = async (menu: Menu) => {
    const res = await fetch('http://localhost:10000/food',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(menu)
    })
}

export const addCartGo = async (menu: Menu) => {
    const res = await fetch('http://localhost:3001/basket',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(menu)
    })
}

export const deleteMenuGo = async (menuId: number) => {
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

export const updateMenuGo = async (menu: Menu) => {
    const res = await fetch(`http://localhost:10000/food/${menu.id}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(menu)
    })
}

export const getTicketGo = async (): Promise<Ticket[]> => {
    const res = await fetch('http://localhost:10000/ticket/Can',{
        cache: 'no-store' //SSR
    })
    const menus = res.json()

    return menus;
}