import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
function App() {
  const location = useLocation(); // Lấy thông tin route hiện tại

  // Kiểm tra nếu route là /login hoặc /signup
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className='flex flex-col min-h-screen'>
      {/* {user ? */}
      {!hideNavbar && <Navbar />}
      {/* : ''} */}
      <div className={`flex-1 relative `}>
        {/* <Header /> */}
        <Outlet />
      </div>

      {!hideNavbar && <Footer />}
    </div>
  )
}

export default App
