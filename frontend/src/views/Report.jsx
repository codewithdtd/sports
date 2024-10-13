import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BookingService from '../services/booking.service';
import UserService from '../services/user.service';
import Facility from '../services/facility.service';
import ReviewService from '../services/review.service'
import RevenueChart from '../components/reports/RevenueChart';
import MostBookedCourtType from '../components/reports/MostBookedCourtType';
const Report = () => {
  const [allCustomer, setAllCustomer] = useState(0);
  const [allBooking, setAllBooking] = useState(0);
  const [allFac, setAllFac] = useState(0);
  const [allReview, setAllReview] = useState(0);
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const bookingService = new BookingService(user, dispatch);
  const customerService = new UserService(user, dispatch);
  const facilityService = new Facility(user, dispatch);
  const reviewService = new ReviewService(user, dispatch);

  const getAll = async () => {
    const users = await customerService.getAll()
    const bookings = await bookingService.getAll()
    const facilities = await facilityService.getAll()
    const reviews = await reviewService.getAll()
    setAllCustomer(users?.length)
    setAllFac(facilities?.length)
    setAllBooking(bookings?.length)
    setAllReview(reviews?.length)
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })

  useEffect(() => {
    getAll()
  }, [])
  return (
    <div>
      <Header name="Báo cáo"/>
      <div className='flex gap-4 h-28'>
        <div className="flex-1 flex justify-around bg-green-200 rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-green-400'>
            <img src="./src/assets/img/booking.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tổng đặt sân</p>
            <p className='text-2xl font-bold'>{allBooking}
              {/* <span> + 15</span> */}
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-around bg-blue-200 rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-blue-400'>
            <img src="./src/assets/img/user.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tổng khách hàng</p>
            <p className='text-2xl font-bold'>{allCustomer}
            </p>
          </div>
        </div><div className="flex-1 flex justify-around bg-yellow-200 rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-yellow-400'>
            <img src="./src/assets/img/sports.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tất cả sân</p>
            <p className='text-2xl font-bold'>{allFac}
            </p>
          </div>
        </div><div className="flex-1 flex justify-around bg-pink-200 rounded-lg shadow-md items-center shadow-gray-400">
          <div className='w-1/4 rounded-full bg-pink-400'>
            <img src="./src/assets/img/rating.png" className='object-contain p-2' alt="" />
          </div>
          <div>
            <p>Tất cả đánh giá</p>
            <p className='text-2xl font-bold'>{allReview}
            </p>
          </div>
        </div>
      </div>
      <div className='py-5 md:flex gap-4 items-stretch'>
        <div className='md:w-3/5'>
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