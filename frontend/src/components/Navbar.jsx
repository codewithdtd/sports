import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (window.innerWidth >= 780) {
        setIsOpen(true);
      }
  };

  // Effect to handle screen resizing
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
  return (
    <div className="navigation z-10 absolute md:relative h-screen">
        <div className='block md:hidden absolute mx-5 w-[30px] translate-y-1/2 pt-1 text-center rounded-lg' onClick={toggleMenu}>
            <i className="ri-menu-line text-xl font-bold"></i>
        </div>
        <div className={`bg-slate-800 shadow-black shadow-md rounded-lg h-[100%] md:block transition-all overflow-hidden ${isOpen ? 'translate-x-0' : 'absolute -translate-x-80'}`}>
            <div className='navigation-group-logo flex justify-center items-center'>
                <img src="./src/assets/img/Logo.svg" alt="" className='navigation-logo w-[20%] py-2' />
                <p className='ml-2 italic font-extrabold text-4xl'>SPORT</p>
                {/* <p>X</p> */}
            </div>
            <ul className="navigation__link text-gray-300">
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} className={({ isActive }) => `${isActive ? " bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`} to="/">
                        <i className="ml-5 ri-pie-chart-2-fill mr-2"></i> 
                        <span>Báo cáo</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`} to="/facility" end>
                        <i className="ml-5 ri-football-line mr-2"></i> 
                        <span>Sân thể thao</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`} to="/sportType" end>
                        <i className="ml-5 ri-bubble-chart-fill mr-2"></i>
                        <span>Phân loại sân</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`} to="/facilityManagement" end>
                        <i className="ml-5 ri-folder-settings-line mr-2"></i> 
                        <span>Quản lý sân</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/booking" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-time-line mr-2"></i> 
                        <span>Đặt sân</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`} to="/invoice">
                        <i className="ml-5 ri-bill-line mr-2"></i> 
                        <span>Hóa đơn</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/equipment" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-tools-line mr-2"></i> 
                        <span>Kho</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/review" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-feedback-line mr-2"></i> 
                        <span>Đánh giá</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/contact" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-feedback-line mr-2"></i> 
                        <span>Liên hệ</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/customer" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-user-line mr-2"></i> 
                        <span>Khách hàng</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/staff" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-folder-user-line mr-2"></i> 
                        <span>Nhân viên</span>
                    </NavLink>
                </li>
                {/* <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/membership" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-shield-user-line mr-2"></i> 
                        <span>Gói hội viên</span>
                    </NavLink>
                </li>
                <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/userMembership" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-shield-user-fill mr-2"></i> 
                        <span>Hội viên</span>
                    </NavLink>
                </li> */}
                {/* <li className="navigation__link__items">
                    <NavLink onClick={toggleMenu} to="/event" className={({ isActive }) => `${isActive ? "bg-green-500 text-gray-800" : ""} p-1 py-2 block m-2 rounded-md hover:text-gray-800 hover:bg-green-500 mx-3 font-medium`}>
                        <i className="ml-5 ri-calendar-event-fill mr-2"></i> 
                        <span>Sự kiện</span>
                    </NavLink>
                </li> */}
            </ul>
        </div>
    </div>
  )
}

export default Navbar