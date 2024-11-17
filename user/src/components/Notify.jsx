import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import NotifyService from '../services/notify.service';
import { useDispatch, useSelector } from "react-redux";

const Notify = (props) => {
    const user = useSelector((state) => state.user.login.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notification, setNotification] = useState([]);
    const notifyService = new NotifyService(user, dispatch);
    const countUnRead = () => {
        return notification.filter(item => item.daXem === false).length;
    }

    const getNotify = async () => {
        const noti = await notifyService.get(user.user._id);
        setNotification(noti);
    }

    const isRead = async (id) => {
        await notifyService.update(id, { daXem: true });
        getNotify();
    }

    useEffect(() => {
        getNotify();
    }, [])
    return (
        <div className='hover:bg-gray-200 z-[2] relative group mr-2 p-1 px-2 aspect-square rounded-full'>
            <i className="ri-notification-2-fill text-gray-700 text-2xl"></i>
            <div className='w-4 h-4 mt-1 absolute top-0 right-1 rounded-full bg-red-500 text-center text-white text-sm leading-4'>{countUnRead()}</div>
            <div className='absolute notify hidden group-hover:block px-2 top-[95%] right-0 min-w-72 sm:w-full bg-white shadow-lg shadow-gray-400 rounded-md overflow-y-scroll max-h-64'>
                <p className='font-semibold text-base border-b border-gray-400 text-blue-600'>Thông báo</p>
                {notification.length > 0 ? notification?.map((item) =>
                    <div className='hover:bg-gray-200' key={item._id} onClick={e => isRead(item._id)}>
                        <div className='flex justify-between font-semibold text-base'>
                            <p className='text-base'>{item.tieuDe}</p>
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
    )
}

export default Notify