'use client'

import React, { useState } from 'react'

const Counter = () => {

  const [count, setCount] = useState(0)
  const IncrementCount = () => {
    setCount(count+1)
  }

  const DecrementCount = () => {
    setCount(count-1)
  }

  return (
    <div className='p-5 rounded bg-white shadow-md flex flex-col items-center'>
        <h1 className='text-xl font-medium  text-gray-700'>Stock counter</h1>
        <div>
          <h1 className='text-xl font-medium  text-blue-700'>{count}</h1>
        </div>
        <div className='space-x-2'>
        <button 
          onClick={() => IncrementCount()} className='px-2 bg-gray-700 text-white shadow-md'>+</button>
        <button onClick={() => DecrementCount()} className='px-2 bg-gray-500 text-white shadow-md'>-</button>
        </div>
        
    </div>
  )
}

export default Counter
