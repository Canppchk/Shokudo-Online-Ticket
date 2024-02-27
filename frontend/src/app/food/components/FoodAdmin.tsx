import { Menu } from '@/app/types'
import Link from 'next/link'
import React from 'react'

interface MenuProps {
    menus: Menu[]
  }

const FoodAdmin = ({menus}:MenuProps) => {
  return (
    <div className="flex justify-center items-center w-full my-20">
        <div className="block max-w-sm p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4">
            {/* edit here */}
            {
                menus.map(menu => (
                  <div key={menu.id} className='flex flex-col space-y-2'>
                      <img src={menu.picture} alt="Menu Item" />
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{menu.name}</h5>
                      <p className="font-normal text-green-700 dark:text-green-400">{menu.price} Yen</p>
                      <p className="font-normal text-gray-700 dark:text-gray-400">{menu.detail}</p>
                      <div className='flex justify-between space-x-2'>
                          <div>
                              <p className="font-normal text-gray-700 dark:text-gray-400">stock left: {menu.stock}</p>
                          </div>
                          <div className="pt-5">
                          <button className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-5 rounded hover:bg-green-600 focus:outline-none">
                              <Link href={`/update`}>Update</Link>
                          </button>
                          </div>
                      </div>
                  </div>
              ))
            }
        </div>
    </div>
  )
}

export default FoodAdmin
