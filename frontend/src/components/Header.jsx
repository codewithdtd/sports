import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import StaffService from '../services/staff.service';
import NotifyService from '../services/notify.service';
function Header(props) {
  const user = useSelector((state) => state.user.login.user);
  const [notification, setNotification] = useState([]);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffService = new StaffService(user, dispatch);
  const notifyService = new NotifyService(user, dispatch);
  const handleLogout = async () => {
    await staffService.logout(dispatch, navigate, accessToken);
  }

  const countUnRead = () => {
    return notification.filter(item => item.daXem === false).length;
  }

  const getNotify = async () => {
    const noti = await notifyService.get(user.user._id);
    setNotification(noti.reverse());
  }

  const isRead = async (id) => {
    await notifyService.update(id, { daXem: true });
    getNotify();
  }

  useEffect(() => {
    getNotify();
  }, [])
  return (
    <div className="header py-1 bg-white mb-2 rounded-xl px-2 items-center pl-12 md:pl-0 flex justify-between">
      <div className="header__left text-xl font-[1000]">
        <p className='text-slate-800 pl-2'>Quản lý / {props.name}</p>
      </div>
      <div className="header__right flex items-center">
        <div className='hover:bg-gray-200 relative group mr-2 p-1 px-2 aspect-square rounded-full'>
          <i className="ri-notification-2-fill text-gray-700 text-2xl"></i>
          <div className='w-4 h-4 mt-1 absolute top-0 right-1 rounded-full bg-red-500 text-center text-white text-sm leading-4'>{countUnRead()}</div>
          <div className='absolute notify hidden group-hover:block px-2 top-[95%] right-0 min-w-72 max-w-1/2 bg-white shadow-lg shadow-gray-400 rounded-md overflow-y-scroll max-h-64 z-[1]'>
            <p className='font-semibold text-sm border-b border-gray-400 text-blue-600'>Thông báo</p>
            {notification.length > 0 ? notification?.map((item) =>
              <div className='hover:bg-gray-200' key={item._id} onClick={e => isRead(item._id)}>
                <div className='flex justify-between font-semibold text-base'>
                  <p className=''>{item.tieuDe}</p>
                  {!item.daXem ?
                    <div className='w-4 h-4 mt-1 rounded-full bg-red-500'></div>
                    : <div className='w-4 h-4 mt-1 rounded-full bg-green-500 leading-4 font-sm text-center text-white'><i className="ri-check-fill"></i></div>
                  }
                </div>
                <p className='text-sm'>{item.noiDung}</p>
                <p className='text-sm text-gray-700 font-semibold'>{item.ngayTao}</p>
              </div>
            ) : <p>Chưa có thông báo</p>}

          </div>
        </div>
        <div className='group relative flex'>
          <div className='flex items-center'>
            <div className="header__item header__user flex rounded-full overflow-hidden">
              <img src={`${user?.user.hinhAnh_NV ? 'http://localhost:3000/uploads/' + user.user.hinhAnh_NV : "./src/assets/img/image.png"}`} alt="" className="object-cover w-[50px] h-[50px]" />
            </div>
            <div className='ml-2 hidden sm:block'>
              {user?.user.ho_NV + ' ' + user?.user.ten_NV} <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>
          <ul className='hidden z-[1] group-hover:block absolute top-[100%] right-0 w-40 sm:w-full bg-white shadow-lg rounded-md overflow-hidden'>
            <li className='font-semibold p-2 text-[13px]'>ID: {user?.user._id}</li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/info">Chỉnh sửa thông tin</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/changePass">Đổi mật khẩu</Link></li>
            <li className=''><Link className='block p-2 hover:bg-slate-300' to="/" onClick={handleLogout}>Đăng xuất</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header