import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import staffService from '../services/staff.service';
function Header(props) {
  const user = useSelector((state) => state.user.login.user);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await staffService.logout(dispatch, navigate, accessToken);
  }
  return (
    <div className="header items-center pl-12 md:pl-0 mr-2 px-2 flex justify-between">
        <div className="header__left uppercase text-2xl font-bold">
            <p>{ props.name }</p>
        </div>
        <div className="header__right group relative flex flex-col">
            <div className='flex items-center'>
              <div className="header__item header__user flex w-[50px] h-[50px] rounded-full overflow-hidden">
                  <img src="./src/assets/img/image.png" alt="" className="object-contain"/>
              </div>
              <div className='ml-2 hidden sm:block'>
                  {user?.user.ho_NV+' '+user?.user.ten_NV} <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
            <ul className='hidden z-[1] group-hover:block absolute top-[100%] right-0 w-40 sm:w-full bg-white shadow-lg rounded-xl overflow-hidden'>
              <li className='font-semibold p-2 text-[13px]'>ID: { user.user._id }</li>
              <li className=''><Link className='block p-2 hover:bg-slate-300' to="/info">Chỉnh sửa thông tin</Link></li>
              <li className=''><Link className='block p-2 hover:bg-slate-300' to="/changePass">Đổi mật khẩu</Link></li>
              <li className=''><Link className='block p-2 hover:bg-slate-300' to="/" onClick={handleLogout}>Đăng xuất</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Header