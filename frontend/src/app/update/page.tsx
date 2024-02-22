"use client";
import React from "react";
import { Menu } from "../types";
import UpdatePage from "./update";

export default function Page() {
    const menu: Menu = {id: 1, name: "Udon", meal: "meal", detail: "Detail", stock: 1, price: 1, picture: "picture", date: "date"}


    return (
        <div>
          <UpdatePage fetchedMenu={menu}></UpdatePage>
        </div>
    )
}
