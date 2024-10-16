import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import User from '../services/user.service';
import Notify from './Notify';
import Booking from '../services/booking.service';

const Navbar = () => {
  const user = useSelector((state) => state.user?.login.user);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [notify, setNotify] = useState(false)
  const [scrolled, setScrolled] = useState(false);
  const bookingService = new Booking(user, dispatch);
  const userService = new User(user, dispatch);
  const handleLogout = async () => {
    await userService.logout(dispatch, navigate, accessToken);
  }

  const [isOpen, setIsOpen] = useState(false);


  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getBooking = async () => {
    const id = { id: user.user._id }
    const data = await bookingService.getAll(id, accessToken, dispatch);
    setList(data.reverse());
    if (data.some((booking) => booking.trangThai == 'Đã duyệt'))
      setNotify(true)

  }
  const updateNavbar = (newState) => {
    setNotify(newState);
  };


  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (window.innerWidth >= 780) {
        setIsOpen(true);
      }
  };

   useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 780) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Initial check when the component mounts
    handleResize();

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
     getBooking();
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex sticky transition-all top-0 z-[2] bg-white border-b-2 border-gray-500 justify-between w-full px-10 items-center h-fit py-3 backdrop-blur-sm 
        ${scrolled ? 'shadow-gray-500 shadow-sm' : ''}`}
    >
      <div className='block md:hidden text-blue-600 absolute mx-2 w-[30px] left-0  text-center rounded-lg' onClick={toggleMenu}>
          <i className="ri-menu-line text-xl font-bold"></i>
      </div>
      <NavLink to='/'>
        <div className="logo flex items-center text-4xl font-bold italic text-blue-700">
          <img src="./src/assets/logo.svg" alt="" className='md:w-3/4' />
          <span className='md:block hidden'>DSOPRT</span>
        </div>
      </NavLink>
        <div className={`flex-1 flex md:flex-row flex-col 
          text-center justify-center font-medium
          md:relative absolute bg-white md:bg-transparent top-full w-1/3 md:w-auto
          shadow-sm shadow-gray-700 md:shadow-none z-10 transition-all
          ${isOpen ? 'left-0' : '-left-full md:left-0'}`}
        >
          <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="/">TRANG CHỦ</NavLink>
          <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="about">GIỚI THIỆU</NavLink>
          <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="booking">ĐẶT SÂN</NavLink>
          {/* <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="event">SỰ KIỆN</NavLink> */}
          <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="review">ĐÁNH GIÁ</NavLink>
          {/* <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="membership">HỘI VIÊN</NavLink> */}
          <NavLink className={({ isActive }) => `${isActive ? "text-blue-500 navbar-link-active" : ""} block navbar-link text-start p-3 md:px-5 hover:text-blue-600 font-medium`} onClick={e => setIsOpen(false)} to="contact">LIÊN HỆ</NavLink>
        </div>

        {/* THông báo */}

      {!user ? 
      <div className='flex text-center'>
        <NavLink className='border-[2px] p-1 px-4 font-bold text-white border-blue-500 bg-blue-500 rounded-full mr-3 hover:bg-blue-600' to='login'>ĐĂNG NHẬP</NavLink>
        <NavLink className='border-[2px] p-1 px-4 font-bold text-blue-500 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white' to='signup'>ĐĂNG KÝ</NavLink>
      </div>
      : 
      <div className="header__right flex items-center">
        <div className='mx-4 group text-gray-500 relative'>
          <i className="text-2xl ri-notification-3-fill"></i>
          { notify ?  
          <p className='absolute text-[12px] rounded-full top-0 -right-1 border-white border-2 bg-red-500 aspect-square w-4 h-4 flex items-center justify-center text-white'></p>
          : ''
          }
          <div className='hidden group-hover:block'>
            <Notify data={list} notify={setNotify} />
          </div> 
        </div>
        <div className='flex group relative sm:min-w-[200px] items-center'>
          <div className="header__item header__user flex w-[50px] h-[50px] rounded-full overflow-hidden">
            {/* <img src="./src/assets/avatar.png" alt="" className="object-contain"/> */}
            <img src={`${user?.user.hinhAnh_KH ? 'http://localhost:3000/uploads/'+user.user.hinhAnh_KH : "./src/assets/user-profile.png"}`} alt="" className="object-cover w-[50px] h-[50px]"/>
          </div>
          <div className='ml-2 hidden sm:block'>
              {user?.user?.ho_KH+' '+user?.user?.ten_KH} <i className="ri-arrow-down-s-line"></i>
          </div>
          <ul className='hidden z-[1] group-hover:block absolute top-[100%] right-0 w-40 sm:w-full bg-white shadow-lg rounded-xl overflow-hidden'>
            <li className='font-semibold p-2 overflow-visible text-[13px]'>ID: {user?.user?._id}</li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/history">Lịch sử đặt sân</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/info">Chỉnh sửa thông tin</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/changePass">Đổi mật khẩu</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/" onClick={handleLogout}>Đăng xuất</Link></li>
          </ul>
        </div>
      </div>
      }
    </div>
  )
}

export default Navbar