import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'

const App = () => {
  return (
    <div className='flex h-screen bg-green-200'>
      <div className='rounded-md h-full md:w-1/4 lg:w-[15%]'>
        <Navbar />
      </div>
      <div className='m-2 flex-1'>
        {/* <Header /> */}
        <Outlet />
      </div>
    </div>
  )
}

export default App

