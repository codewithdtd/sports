import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer bg-[#22273c] text-white py-10'>
        <div className='md:flex-row flex flex-col md:items-start md:text-start items-center text-center'>
            <div className='flex-1'>
                <div className="logo flex items-center">
                    <img src="./src/assets/logo.svg" alt="" className='md:w-1/4'/>
                    <p className='text-3xl font-bold'>Sports: A game of life</p>
                </div>
            </div>
            <div className='flex-1 md:flex md:justify-end'>
                <div className='md:pr-20'>
                    <h4 className='text-lg'>Sân DSport</h4>
                    <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="/">Trang chủ</NavLink>
                    <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="about">Giới thiệu</NavLink>
                    <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="booking">Đặt sân</NavLink>
                    <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="membership">Đánh giá</NavLink>
                    {/* <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="membership"></NavLink> */}
                    <NavLink className={`block hover:text-gray-400 opacity-60 hover:translate-x-1 transition-all`} to="contact">Liên hệ</NavLink>
                </div>
            </div>
            <div className='flex-1'>
                <h4 className='text-lg'>Thông tin</h4>
                <p className='opacity-70'>Số điện thoại: 0111 222 333</p>
                <p className='opacity-70'>Email: dsport@gmail.com</p>
                <p className='opacity-70'>Địa chỉ: phường Xuân Khánh, quận Ninh Kiều, TP Cần Thơ</p>
            </div>
            <div className='flex-1 ml-10'>
                <p className='pb-5'>Mạng xã hội</p>
                <a href="#">
                    <i className="mr-5 hover:opacity-70 text-5xl ri-facebook-circle-fill"></i>
                </a>
                <a href="#">
                    <i className="mr-5 hover:opacity-70 text-5xl ri-instagram-fill"></i>
                </a>
                <a href="#">
                    <i className="mr-5 hover:opacity-70 text-5xl ri-tiktok-fill"></i>
                </a>
            </div>
        </div>
        <p className='text-center'><i className="ri-copyright-line"></i> 2024 DSport. All Rights Reserved.</p>
    </div>
  )
}

export default Footer