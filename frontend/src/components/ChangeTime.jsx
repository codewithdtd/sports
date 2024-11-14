import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Time from '../services/time.service';
const ChangeTime = (props) => {
    const [time, setTime] = useState({});
    const user = useSelector((state) => state.user.login.user)
    const dispatch = useDispatch();
    const timeService = new Time(user, dispatch)
    const getTime = async () => {
        const fetchTime = await timeService.getAll();
        setTime(fetchTime[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(time);
        if (await timeService.update(time._id, time))
            props.toggle(false);
    }
    useEffect(() => {
        getTime();
    }, [])
    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-[1] flex' onClick={e => props.toggle(false)}>
            <form className='bg-white relative h-fit w-1/2 md:w-1/3 m-auto p-4 rounded-md' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
                <h2 className='font-bold text-2xl text-center mb-6'>
                    THỜI GIAN HOẠT ĐỘNG
                </h2>
                <div className='text-center text-lg'>
                    <div className='flex justify-between items-center'>
                        <p>Thời gian mở cửa:</p>
                        <input type="time" className='border border-gray-400 p-2' value={time.thoiGianMoCua} onChange={e => setTime({ ...time, thoiGianMoCua: e.target.value })} />
                    </div>
                    <div className='flex mt-3 justify-between items-center'>
                        <p>Thời gian đóng cửa:</p>
                        <input type="time" className='border border-gray-400 p-2' value={time.thoiGianDongCua} onChange={e => setTime({ ...time, thoiGianDongCua: e.target.value })} />
                    </div>
                    <button className='bg-blue-600 p-2 mt-5 px-8 rounded-sm text-white'>Xác nhận</button>
                </div>
            </form>
        </div>
    )
}

export default ChangeTime