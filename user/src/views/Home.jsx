import React from 'react'
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className='home'>
        <div className='home-container flex flex-col items-center justify-center w-full h-[88vh]'>
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
          <NavLink className='font-bold px-10 py-2 pt-3 text-white bg-[#00BA29] rounded-lg hover:bg-[#006f18]' to='booking'>ĐẶT SÂN NGAY</NavLink>
        </div>
      </div>
      <h2 className='text-center font-medium pt-4 text-xl'>Đa dạng các bộ môn thể thao</h2>
      <p className='px-4 text-center'>Ở đây có đa dạng các bộ môn thể thao cho các bạn thử sức từ bóng đá, bóng chuyền đến cầu lông bóng rổ, cầu lông </p>
      <div className='bg-white p-4 flex gap-3 items-center justify-center w-full h-[88vh]'>
        <div className='w-1/4 shadow-md shadow-gray-400 h-full relative rounded-lg overflow-hidden'>
          <img src="./src/assets/home1.jpg" alt="" className='h-full object-cover' />
        </div>
        <div className='w-1/4 shadow-md shadow-gray-400 h-full relative rounded-lg overflow-hidden'>
          <img src="./src/assets/home2.jpg" alt="" className='h-full object-cover' />
        </div>
        <div className='w-1/4 shadow-md shadow-gray-400 h-full relative rounded-lg overflow-hidden'>
          <img src="./src/assets/home3.jpg" alt="" className='h-full object-cover' />
        </div>
        <div className='w-1/4 shadow-md shadow-gray-400 h-full relative rounded-lg overflow-hidden'>
          <img src="./src/assets/home4.jpg" alt="" className='h-full object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Home