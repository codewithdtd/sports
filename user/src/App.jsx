import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import './App.css'
import Navbar from './components/Navbar'
function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      {/* {user ? */}
        <Navbar />
      {/* : ''} */}
      <div className={`flex-1 relative `}>
        {/* <Header /> */}
        <Outlet />
      </div>
    </div>
  )
}

export default App
