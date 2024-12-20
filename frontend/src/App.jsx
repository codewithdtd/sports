import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import Navbar from './components/Navbar'
const App = () => {
  const user = useSelector((state)=> state.user.login.user)
  
  return (

    <div className='flex min-h-screen h-fit bg-slate-200'>
      {user ?
      <div className='rounded-md h-full md:w-1/5 lg:w-[15%] md:sticky top-0'>
        <Navbar />
      </div> : ''}
      <div className={`${user ? 'p-2 px-5' : ''} flex-1 relative`}>
        {/* <Header /> */}
        <Outlet />
      </div>
    </div>
  )
}

export default App

