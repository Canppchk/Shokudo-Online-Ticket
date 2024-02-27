import React from 'react'
import { Menu } from '../../types'

interface MenuProps {
  menus: Menu[]
}

// Because it is a destructuring assignment, it is written as {menus}:MenuProps instead of props: MenuProps.
const MenuList = ({menus}:MenuProps) => {
  
  return (
    
    <div className="m-3 p-3 rounded bg-white shadow-md flex flex-wrap">
      
      {
        menus.map(menu => (
          <div key={menu.id} className='w-1/3'>
            <div className="m-2 max-w-md overflow-hidden rounded-lg bg-white shadow">
              <img src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" className="aspect-video w-full object-cover" alt="" />
              <div className="p-4">
                <p className="mb-1 text-sm text-primary-500">added • <time>18 Nov 2023</time></p>
                <h3 className="text-xl font-medium text-gray-900">{menu.name}</h3>
                <p className="mt-1 text-gray-500">This food include egg, apple, ...</p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-yellow-600"> nodle </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"> big </span>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>

    // better design
    /* </div>
        <div className="relative mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow">
        <div>
          <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" className="w-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black"></div>
        <div className="absolute inset-x-0 bottom-0 z-20 p-4">
          <p className="mb-1 text-sm text-white text-opacity-80">Andrea Felsted • <time>18 Nov 2022</time></p>
          <h3 className="text-xl font-medium text-white">Migrating to Sailboat UI</h3>
          <p className="mt-1 text-white text-opacity-80">Sailboat UI is a modern UI component library for Tailwind CSS. Get started with 150+ open source components.</p>
        </div>
    </div> */
  )
}

export default MenuList
