import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import StaffService from '../services/staff.service';
function Header(props) {
  const user = useSelector((state) => state.user.login.user);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffService = new StaffService(user, dispatch);
  const handleLogout = async () => {
    await staffService.logout(dispatch, navigate, accessToken);
  }
  return (
    <div className="header py-1 bg-white mb-2 rounded-xl px-2 items-center pl-12 md:pl-0 flex justify-between">
        <div className="header__left text-xl font-[1000]">
          <p className='text-slate-800 pl-2'>Quản lý / { props.name }</p>
        </div>
        <div className="header__right group relative flex flex-col">
          <div className='flex items-center'>
            <div className="header__item header__user flex rounded-full overflow-hidden">
                <img src={`${user?.user.hinhAnh_NV ? 'http://localhost:3000/uploads/'+user.user.hinhAnh_NV : "./src/assets/img/image.png"}`} alt="" className="object-cover w-[50px] h-[50px]"/>
            </div>
            <div className='ml-2 hidden sm:block'>
                {user?.user.ho_NV+' '+user?.user.ten_NV} <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>
          <ul className='hidden z-[1] group-hover:block absolute top-[100%] right-0 w-40 sm:w-full bg-white shadow-lg rounded-xl overflow-hidden'>
            <li className='font-semibold p-2 text-[13px]'>ID: { user?.user._id }</li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/info">Chỉnh sửa thông tin</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/changePass">Đổi mật khẩu</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/" onClick={handleLogout}>Đăng xuất</Link></li>
          </ul>
        </div>
    </div>
  )
}

export default Header