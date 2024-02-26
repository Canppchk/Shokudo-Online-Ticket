export interface Menu {
    id: number
    // id: string
    name: string
    meal: string
    detail: string
    stock: number
    price: number
    picture: string
    date: string
}

export interface User {
    email: string
    password: string
}

export interface Ticket {
    id: number
    food_id: number
    date: string
    status: string
    owner: string
}