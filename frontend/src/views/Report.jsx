import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../components/reports/RevenueChart';
import MostBookedCourtType from '../components/reports/MostBookedCourtType';
const Report = () => {
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  return (
    <div>
      <Header name="Báo cáo"/>
      <div className='flex gap-4 h-28'>
        <div className="flex-1 flex justify-around bg-white rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-blue-400'>
            <img src="./src/assets/img/booking.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tổng đặt sân</p>
            <p className='text-2xl font-bold'>12.345
              <span> + 15</span>
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-around bg-white rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-blue-400'>
            <img src="./src/assets/img/user.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tổng khách hàng</p>
            <p className='text-2xl font-bold'>12.345
            </p>
          </div>
        </div><div className="flex-1 flex justify-around bg-white rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-blue-400'>
            <img src="./src/assets/img/sports.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tất cả sân</p>
            <p className='text-2xl font-bold'>12.345
            </p>
          </div>
        </div><div className="flex-1 flex justify-around bg-white rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-blue-400'>
            <img src="./src/assets/img/rating.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tất cả đánh giá</p>
            <p className='text-2xl font-bold'>12.345
            </p>
          </div>
        </div>
      </div>
      <div className='py-5 md:flex gap-4 items-stretch'>
        <div className='md:w-3/5 h-full'>
          <RevenueChart />
        </div>
        <div className='flex-1'>
          <MostBookedCourtType />
        </div>
      </div>
    </div>
  )
}

export default Report