"use client";
import React from "react";
import { Menu } from "../types";
import UpdatePage from "./update";

export default function Page() {
    const menu: Menu = {id: 2, name: "aaa", meal: "Dinner", detail: "aaaa", stock: 3, price: 400.00, picture: "aaa", date: "2024-01-26"}

    return (
        <div>
          <UpdatePage fetchedMenu={menu}></UpdatePage>
        </div>
    )
}
