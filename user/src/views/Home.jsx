import React from 'react'
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className='main'>
      <div className='home mx-2 md:mx-5 rounded-2xl overflow-hidden'>
        <div className='home-container flex flex-col items-center justify-center w-full h-[85vh]'>
          <div className='flex flex-col items-center justify-center'>
            <p className='md:text-[70px] text-[60px] font-bold text-white'>
              <span className='text-[#00BA29]'>Sports: </span> 
              A game of 
              <span className='text-[#00BA29]'> life</span>
            </p>
            <p className='text-white w-3/4 py-2 text-lg'>
            Nơi đam mê thể thao thăng hoa! Với không gian xanh mát, thoáng đãng, cùng hệ thống trang thiết bị hiện đại, chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời nhất. Đội ngũ huấn luyện viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn đạt được mục tiêu thể lực. Đặc biệt, chúng tôi đang có chương trình giảm giá 20% cho khách hàng đăng ký thành viên mới trong tháng này. Đừng bỏ lỡ cơ hội trải nghiệm!
            </p>
          </div>
          <NavLink className='font-bold px-10 py-2 pt-3 text-white bg-green-600 rounded-full hover:bg-[#006f18]' to='booking'>ĐẶT SÂN NGAY</NavLink>
        </div>
      </div>
      <h2 className='text-center font-bold pt-4 text-4xl'>Đa dạng các bộ môn thể thao</h2>
      <p className='px-4 text-center text-lg'>Ở đây có đa dạng các bộ môn thể thao cho các bạn thử sức từ bóng đá, bóng chuyền đến cầu lông bóng rổ, cầu lông...</p>
      <div className='p-7 h-fit grid grid-cols-2 md:grid-cols-4 gap-7'>
        <div className='text-center overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home1.jpg" alt="" className='w-full border-2 border-gray-400 shadow-gray-500 h-40 rounded-lg object-cover' />
          <div className='flex justify-between px-1 items-center'>
            <div>
              <p className='font-bold text-lg text-start '>Bóng đá</p>
              <p className='text-start text-sm font-medium text-gray-700'>Bóng đá là niềm đam mê.</p>
            </div>
            <p className='bg-gray-800 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div> 
        <div className='text-center overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home2.jpg" alt="" className='w-full border-2 border-gray-400 shadow-gray-500 h-40 rounded-lg object-cover' />
          <div className='flex justify-between px-1 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Bóng rỗ</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Rổ là đích đến.</p>
            </div>
            <p className='bg-gray-800 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div> 
        <div className='text-center overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home3.jpg" alt="" className='w-full border-2 border-gray-400 shadow-gray-500 h-40 rounded-lg object-cover' />
          <div className='flex justify-between px-1 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Bóng chuyền</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Bóng chuyền thật hấp dẫn.</p>
            </div>
            <p className='bg-gray-800 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div> 
        <div className='text-center overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home4.jpg" alt="" className='w-full border-2 border-gray-400 shadow-gray-500 h-40 rounded-lg object-cover' />
          <div className='flex justify-between px-1 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Cầu lông</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Vợt đan, cầu lông bay.</p>
            </div>
            <p className='bg-gray-800 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div> 
      </div>
      <div className='bg-gradient-to-b from-[#1d6926] to-[#00ff51] py-10'>
        <h2 className='text-center font-bold pt-4 text-4xl text-white'>Tại sao là DSport</h2>
        <div className='flex gap-5 justify-center p-5'>
          <div className='h-80 shadow-md bg-white shadow-gray-500 border-2 border-gray-400 rounded-lg w-1/3 md:w-1/5 text-2xl flex flex-col items-center justify-center'>
            <img src="./src/assets/salary.png" className='w-1/2' alt="" />
            <h2 className='font-extrabold w-full text-center'>Giá cả hợp lý</h2>
          </div>
          <div className='h-80 shadow-md bg-white shadow-gray-500 border-2 border-gray-400 rounded-lg w-1/3 md:w-1/5 text-2xl flex flex-col items-center justify-center'>
            <img src="./src/assets/clock.png" className='w-1/2 ' alt="" />
            <h2 className='font-extrabold w-full text-center'>Thời gian linh hoạt</h2>
          </div>
          <div className='h-80 shadow-md bg-white shadow-gray-500 border-2 border-gray-400 rounded-lg w-1/3 md:w-1/5 text-2xl flex flex-col items-center justify-center'>
            <img src="./src/assets/star.png" className='w-1/2 ' alt="" />
            <h2 className='font-extrabold w-full text-center'>Trang thiết bị hiện đại</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home