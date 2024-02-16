'use client'

import { Menu, addMenu } from '@/app/types'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { v4 as uuidv4} from 'uuid';

interface MenuProps{
    menus: Menu[]
    addMenu: (additionalMenu: addMenu) => void
    deleteMenu: (menuId: number) => void
}

const MenuManagement = ({menus, addMenu, deleteMenu}:MenuProps) => {
    const [text,setText] = useState('')

    const handleAddMenu = async (event: React.FormEvent) => {
        event.preventDefault(); // デフォルトのフォーム送信を防ぐ

        if (text.trim() === '') {
            alert('Please enter a menu item.');
            return;
        }

        // await addMenu({ id: uuidv4(), name: text });
        await addMenu({id: 1 , name: text, meal: 'Dinner', detail: 'bibibi', stock: 3, price: 400.00, picture: 'aaa', date: ""});
        setText('');
    };

    return (
        <div className='bg-white shadow-md p-5'>
            <h1 className='text-xl text-gray-700 font-medium '>Menu Management</h1>
            <div className='bg-black text-white rounded p-2 m-2 shadow-md'>
                {text}
            </div>
            <div className='flex items-center space-x-2'>
            <form onSubmit={handleAddMenu}>
                <input type="text" className='border rounded' onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)} value={text} />
                <button type="submit" className='p-1 bg-gray-500 text-white shadow-md rounded'>Add</button>
            </form>
            </div>
            
            {
                menus.map(menu => (
                    <div key = {menu.id} className='flex items-center space-x-2'>
                        <div className='m-2 text-gray-500'>
                            {menu.meal}
                        </div>
                        <button className='px-1 bg-gray-500 text-white shadow-md rounded'>⚙️</button>
                        <button onClick={() => {deleteMenu(menu.id)}} className='px-2 bg-gray-500 text-white shadow-md rounded'>-</button>
                    </div>
                ))
            }

        </div>
    )
}

export default MenuManagement
