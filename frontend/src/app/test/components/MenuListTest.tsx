'use client'

import { Menu } from '@/app/types'
import React from 'react'

interface MenuProps{
    menus: Menu[]
    addCart: (menu: Menu) => void
}

const MenuListTest = ({menus, addCart}:MenuProps) => {

    return (
        <div className='bg-white shadow-md p-5'>
            <h1 className='text-xl text-gray-700 font-medium '>Menu List Test</h1>

            {
                menus.map(menu => (
                    <div key = {menu.id} className='flex items-center space-x-2'>
                        <div className='m-2 text-gray-500'>
                            {menu.meal}
                        </div>
                        {/* TODO: should be able to add same menu to cart twice */}
                        <button onClick={() => {addCart(menu)}} className='px-2 bg-red-700 text-white shadow-md rounded'>+</button>
                    </div>
                ))
            }

        </div>
    )
}

export default MenuListTest
