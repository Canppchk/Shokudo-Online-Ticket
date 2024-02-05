'use client'

import { getAllMenus } from '@/app/api'
import { Menu } from '@/app/types'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { v4 as uuidv4} from 'uuid';

interface MenuProps{
    menus:Menu[]
    setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}

const MenuManagement = ({menus, setMenus}:MenuProps) => {
    const [text,setText] = useState('')

    const addMenu = (text:string) => {
        const addtionalMenu = {
            id: uuidv4(),
            menu: text
        }
        setMenus([addtionalMenu, ...menus])
    }

    const deleteMenu = (menuId: string) => {
        const deletedMenu = menus.filter(menu => menu.id !== menuId)
        setMenus(deletedMenu)
    }

    //rendering by the time that menus change
    useEffect(() => {
        console.log(menus)
    },[menus]);

    return (
        <div className='bg-white shadow-md p-5'>
            <h1 className='text-xl text-gray-700 font-medium '>Menu Management</h1>
            <div className='bg-black text-white rounded p-2 m-2 shadow-md'>
                {text}
            </div>
            <div className='flex items-center space-x-2'>
                <form >
                    <input type="text" className='border rounded' onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)} value={text} />
                </form>
                <button onClick={() => addMenu(text)} className='p-1 bg-gray-500 text-white shadow-md rounded'>Add</button>
            </div>
            
            {
                menus.map(menu => (
                    <div key = {menu.id} className='flex items-center space-x-2'>
                        <div className='m-2 text-gray-500'>
                            {menu.menu}
                        </div>
                        {/* <button onClick={() => updateMenu(menu.id)} className='px-1 bg-gray-500 text-white shadow-md rounded'>⚙️</button> */}
                        <button onClick={() => deleteMenu(menu.id)} className='px-2 bg-red-700 text-white shadow-md rounded'>-</button>
                    </div>
                ))
            }
        </div>
    )
}

export default MenuManagement
