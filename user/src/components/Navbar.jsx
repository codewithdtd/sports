import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import userService from '../services/user.service';

const Navbar = () => {
  const user = useSelector((state) => state.user?.login.user);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await userService.logout(dispatch, navigate, accessToken);
  }
  return (
    <div className='flex sticky top-0 z-[1] bg-white shadow-md shadow-gray-500 justify-between w-full px-10 items-center h-fit py-3'>
      <NavLink to='/'>
        <div className="logo">
          <img src="./src/assets/logo.svg" alt="" className='md:w-3/4' />
        </div>
      </NavLink>
      <div className='flex-1 text-center flex justify-center font-medium'>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="/">TRANG CHỦ</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="about">GIỚI THIỆU</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="booking">ĐẶT SÂN</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="event">SỰ KIỆN</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="membership">HỘI VIÊN</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? "text-green-500 navbar-link-active" : ""} block navbar-link px-5 hover:text-green-600 font-medium`} to="contact">LIÊN HỆ</NavLink>
      </div>
      {!user ? 
      <div>
        <NavLink className='border-[2px] p-1 px-4 font-bold text-white border-green-500 bg-green-500 rounded-full mr-3 hover:bg-green-600' to='login'>ĐĂNG NHẬP</NavLink>
        <NavLink className='border-[2px] p-1 px-4 font-bold text-green-500 border-green-500 rounded-full hover:bg-green-500 hover:text-white' to='signup'>ĐĂNG KÝ</NavLink>
      </div>
      : 
      <div className="header__right group relative flex flex-col">
        <div className='flex items-center'>
          <div className="header__item header__user flex w-[50px] h-[50px] rounded-full overflow-hidden">
              <img src="./src/assets/background.png" alt="" className="object-contain"/>
          </div>
          <div className='ml-2 hidden sm:block'>
              {user?.user.ho_KH+' '+user?.user.ten_KH} <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>
        <ul className='hidden z-[1] group-hover:block absolute top-[100%] right-0 w-40 sm:w-full bg-white shadow-lg rounded-xl overflow-hidden'>
          <li className='font-semibold p-2 overflow-visible'>ID: {user?.user._id}</li>
          <li className=''><Link className='block p-2 hover:bg-slate-300' to="/info">Chỉnh sửa thông tin</Link></li>
          <li className=''><Link className='block p-2 hover:bg-slate-300' to="/changePass">Đổi mật khẩu</Link></li>
          <li className=''><Link className='block p-2 hover:bg-slate-300' to="/" onClick={handleLogout}>Đăng xuất</Link></li>
        </ul>
      </div>
      }
    </div>
  )
}

export default Navbar