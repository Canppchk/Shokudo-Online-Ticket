import { Menu } from '@/app/types'
import React from 'react'

interface BasketProps {
  basket: Menu[]
}

const Basket = ({basket}:BasketProps) => {

  return (
    <div className='bg-white shadow-md rounded '>
      <h1 className='text-xl text-gray-700 font-medium '>Menu List Test</h1>
      {
        basket.map(menu => (
          <div key = {menu.id} className='flex items-center space-x-2'>
            <div className='m-2 text-gray-500'>
              {menu.name}
            </div>
          </div>
            ))
      }
    </div>

  )
}

export default Basket
