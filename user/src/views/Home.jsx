import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

const Home = () => {
  const [showHomeContainer, setShowHomeContainer] = useState(false);

  useEffect(() => {
    // Chờ 500ms rồi mới hiển thị thẻ home-container
    const timer = setTimeout(() => {
      setShowHomeContainer(true);
    }, 200);

    return () => clearTimeout(timer); // Cleanup timer khi component unmount
  }, []);

  return (
    <div className='main'>
      <div className='home overflow-hidden'>
        <div className={`home-container`}>
          <div className={`flex flex-col items-center justify-center w-full h-[90vh] transition-all duration-500 ease-in ${showHomeContainer ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-20'}`}>
            <div className='flex flex-col items-center justify-center'>
              <p className='md:text-[70px] text-[60px] font-bold text-white'>
                <span className='text-[#2264ff]'>Sports: </span>
                A game of
                <span className='text-[#2264ff]'> life</span>
              </p>
              <p className='text-white w-3/4 py-2 text-lg'>
                Nơi đam mê thể thao thăng hoa! Với không gian xanh mát, thoáng đãng, cùng hệ thống trang thiết bị hiện đại, chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời nhất. Đội ngũ huấn luyện viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn đạt được mục tiêu thể lực. Đặc biệt, chúng tôi đang có chương trình giảm giá 20% cho khách hàng đăng ký thành viên mới trong tháng này. Đừng bỏ lỡ cơ hội trải nghiệm!
              </p>
            </div>
            <NavLink className='font-bold px-10 py-2 pt-3 text-white bg-blue-600 rounded-full hover:bg-[#00326f]' to='booking'>ĐẶT SÂN NGAY</NavLink>
          </div>
        </div>
      </div>
      <h2 className='p-7 font-bold pt-20 text-5xl'>Đa dạng các bộ môn thể thao</h2>
      <p className='p-7 pt-0 text-lg'>Ở đây có đa dạng các bộ môn thể thao cho các bạn thử sức từ bóng đá, bóng chuyền đến cầu lông bóng rổ, cầu lông...</p>
      <div className='p-7 pt-0 pb-20 h-fit grid grid-cols-2 md:grid-cols-4 gap-7'>
        <div className='text-center shadow-gray-500 shadow-lg border p-3 overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home1.jpg" alt="" className='w-full border-white h-56 rounded-lg object-cover' />
          <div className='flex justify-between p-2 items-center'>
            <div>
              <p className='font-bold text-lg text-start'>Bóng đá</p>
              <p className='text-start text-sm font-medium text-gray-700'>Bóng đá là niềm đam mê.</p>
            </div>
            <p className='bg-sky-600 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div>
        <div className='text-center shadow-gray-500 shadow-lg border p-3 overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home2.jpg" alt="" className='w-full border-white shadow-gray-500 h-56 rounded-lg object-cover' />
          <div className='flex justify-between p-2 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Bóng rỗ</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Rổ là đích đến.</p>
            </div>
            <p className='bg-sky-600 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div>
        <div className='text-center shadow-gray-500 shadow-lg border p-3 overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home3.jpg" alt="" className='w-full border-white shadow-gray-500 h-56 rounded-lg object-cover' />
          <div className='flex justify-between p-2 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Bóng chuyền</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Bóng chuyền thật hấp dẫn.</p>
            </div>
            <p className='bg-sky-600 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div>
        <div className='text-center shadow-gray-500 shadow-lg border p-3 overflow-hidden flex-1 relative rounded-lg'>
          <img src="./src/assets/home4.jpg" alt="" className='w-full border-white shadow-gray-500 h-56 rounded-lg object-cover' />
          <div className='flex justify-between p-2 items-center'>
            <div>
              <p className='font-bold text-lg p-1 pb-0 text-start '>Cầu lông</p>
              <p className='text-start pl-1 text-sm font-medium text-gray-700'>Vợt đan, cầu lông bay.</p>
            </div>
            <p className='bg-sky-600 p-1 px-3 rounded-full text-sm text-white font-bold'>DSport</p>
          </div>
        </div>
      </div>
      <div className='py-10'>
        <h2 className='pl-7 font-bold pt-4 text-5xl'>Tại sao là DSport</h2>
        <div className='flex flex-col md:flex-row gap-5 justify-center p-5'>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/money.png" className='w-1/12 md:w-1/5' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Giá cả hợp lý</h2>
              <p className='text-base'>Chúng tôi luôn cố gắng cung cấp sản phẩm chất lượng với giá cả cạnh tranh. Chúng tôi tin rằng đây là cách tốt nhất để phát triển bền vững và đáp ứng nhu cầu của khách hàng.</p>
            </div>
          </div>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/timetable.png" className='w-1/12 md:w-1/5 ' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Thời gian linh hoạt</h2>
              <p className='text-base'>Thời gian linh hoạt trong việc đặt lịch sân thể thao đã trở thành một tiêu chí quan trọng đối với người chơi thể thao. Nhờ có các ứng dụng và phần mềm quản lý, người dùng có thể dễ dàng đặt sân bất cứ khi nào họ muốn, mà không bị giới hạn bởi khung giờ cố định.</p>
            </div>
          </div>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/modernization.png" className='w-1/12 md:w-1/5 ' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Trang thiết bị hiện đại</h2>
              <p className='text-base'>Khác biệt với các sân thể thao truyền thống, sân của chúng tôi được trang bị những công nghệ hiện đại nhất. Hệ thống camera giám sát, màn hình hiển thị điểm số và các ứng dụng đặt lịch trực tuyến sẽ mang đến cho bạn trải nghiệm hoàn toàn mới mẻ và tiện lợi.</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-5 justify-center p-5'>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/sports.png" className='w-1/12 md:w-1/5' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Đa đạng các bộ môn thể thao</h2>
              <p className='text-base'>Với hệ thống sân đa dạng, từ sân bóng đá sôi động, sân tennis đẳng cấp, sân cầu lông chuyên nghiệp cho đến các khu vực tập luyện đa năng, chúng tôi đáp ứng mọi nhu cầu luyện tập của bạn.</p>
            </div>
          </div>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/broom.png" className='w-1/12 md:w-1/5 ' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Sạch sẽ và thoải mái</h2>
              <p className='text-base'>Muốn tận hưởng không gian tập luyện thoải mái và sạch sẽ? Sân của chúng tôi luôn được dọn dẹp kỹ lưỡng, đảm bảo bạn có một buổi tập luyện thật hiệu quả. Với mặt sân phẳng mịn, không bụi bẩn, bạn có thể tập trung vào việc nâng cao thể lực mà không lo ngại về vấn đề vệ sinh.</p>
            </div>
          </div>
          <div className='min-h-40 flex-1 py-4 shadow-lg bg-white bg-opacity-75 shadow-gray-400 border border-gray-300 rounded-lg text-2xl flex px-5 items-center justify-center'>
            <img src="./src/assets/help-desk.png" className='w-1/12 md:w-1/5 ' alt="" />
            <div className='pl-4 text-start'>
              <h2 className='w-full font-medium'>Đội ngũ hỗ trợ</h2>
              <p className='text-base'>Với đội ngũ nhân viên giàu kinh nghiệm và nhiệt huyết, chúng tôi luôn sẵn sàng hỗ trợ bạn từ khâu đặt sân, tư vấn lựa chọn sân phù hợp cho đến quá trình diễn ra trận đấu. Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home