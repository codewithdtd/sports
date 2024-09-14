import React from 'react'

const About = () => {
  return (
    <div className='p-2 py-3'>
      <div className='flex flex-col'>
        <div className='flex-1 flex flex-col md:flex-row px-3'>
          <div className="flex-1 pr-5">
            <h1 className='text-2xl font-medium py-3'>DSport - Thiên đường thể thao dành cho mọi người</h1>
            <p className='md:text-lg pb-8'>Bạn là tín đồ của bóng đá sôi động, đam mê những pha bóng rổ ngoạn mục, yêu thích sự dẻo dai của cầu lông hay sự phối hợp nhịp nhàng của bóng chuyền? DSport chính là điểm đến lý tưởng dành cho bạn!</p>
            <p className='md:text-lg pb-8'>Nằm tại Cần Thơ, DSport tự hào là một trong những trung tâm thể thao hiện đại và đa dạng nhất khu vực. Với hệ thống sân bãi được đầu tư bài bản, bao gồm sân bóng đá mini tiêu chuẩn, sân bóng rổ chuyên nghiệp, sân cầu lông và bóng chuyền rộng rãi, DSport đáp ứng mọi nhu cầu tập luyện và thi đấu của khách hàng.</p>
            <p className='md:text-lg pb-8'>Sân bóng đá: Sân bóng đá mini tại DSport được thiết kế theo tiêu chuẩn quốc tế, với mặt sân cỏ nhân tạo chất lượng cao, hệ thống chiếu sáng hiện đại, đảm bảo mang đến những trận đấu kịch tính và hấp dẫn. Dù bạn là một cầu thủ chuyên nghiệp hay chỉ đơn giản là muốn rèn luyện sức khỏe, sân bóng đá DSport đều là lựa chọn hoàn hảo.</p>
            <p className='md:text-lg pb-8'>Sân bóng rổ: Các tín đồ bóng rổ sẽ được thỏa sức thể hiện tài năng của mình trên sân bóng rổ chuyên nghiệp tại DSport. Với không gian rộng rãi, thoáng mát, hệ thống rổ chuẩn, sân bóng rổ DSport là địa điểm lý tưởng để bạn rèn luyện kỹ năng cá nhân, tham gia các giải đấu hoặc đơn giản chỉ là chơi bóng cùng bạn bè.</p>
            <p className='md:text-lg '>Sân cầu lông và bóng chuyền: Nếu bạn yêu thích những môn thể thao đòi hỏi sự nhanh nhẹn và khéo léo, thì sân cầu lông và bóng chuyền tại DSport chắc chắn sẽ làm bạn hài lòng. Với những đường kẻ rõ ràng, lưới căng đều, sân cầu lông và bóng chuyền DSport sẽ giúp bạn nâng cao kỹ năng và có những giờ phút thư giãn thoải mái.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src="./src/assets/about.png" alt="" className='object-contain  pb-4'/>
            <img src="./src/assets/about1.jpg" alt="" className='object-contain'/>
          </div>
        </div>
        <div className='flex-1 pt-2 flex flex-col md:flex-row gap-4 items-center justify-center md:text-lg'>
          <div className='flex-1'>
            <img src="./src/assets/about2.jpg" alt="" className='object-contain' />
          </div>
          <div className='flex-1'>
            <p className='font-medium'>Không chỉ có sân bãi, DSport còn cung cấp nhiều tiện ích khác như:</p>
            <ul className='ml-4 list-disc'>
              <li className='my-2' >Phòng thay đồ sạch sẽ: Được trang bị đầy đủ tiện nghi, giúp bạn thoải mái thay đồ trước và sau khi tập luyện.</li>
              <li className='my-2' >Khu vực nghỉ ngơi: Với không gian thoáng mát, bạn có thể thư giãn và trò chuyện cùng bạn bè sau khi chơi thể thao.</li>
              <li className='my-2' >Cho thuê dụng cụ thể thao: Nếu bạn chưa có dụng cụ thể thao, đừng lo lắng, DSport có dịch vụ cho thuê các loại vợt, bóng, giày thể thao...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About