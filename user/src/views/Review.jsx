import React, { useEffect, useState } from 'react'
import sportTypeService from '../services/sportType.service';
import listReviewervice from '../services/review.service';
import { useSelector } from 'react-redux';
import Pagination from '../components/Pagination';
const Review = () => {
  const [listReview, setListReview] = useState([]);
  const [feedback, setFeedback] = useState('');// Đánh giá hiện tại của người dùng // Danh sách các đánh giá
  const [comment, setComment] = useState(''); // Bình luận của người dùng


  const [currentPage, setCurrentPage] = useState(1)
  
  const user = useSelector((state)=> state.user.login.user)
  // Xử lý khi người dùng chọn đánh giá "Tốt" hoặc "Tệ


  const convertString = () => {
    return listReview.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      return [ ho_KH, ten_KH, email_KH, sdt_KH, item.danhGia, item.noiDung, item.ngayTao_DG ].join(" ").toLowerCase();
    });
  }

  const filterFacility = () => {
    if(feedback == '') 
      return listReview;


    const searchTerms = feedback.toLowerCase().split(' ');
    const convertedStrings = convertString();
    const filteredlist = listReview.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      )
    );
    return filteredlist;
  }
  const totalPages = Math.ceil(filterFacility().length / 5);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // API
  const getAll = async () => {
    try {
      const review = await listReviewervice.getAll();
      setListReview(review);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getAll();
  }, [])
  return (
    <div className='p-5'>
      <h1 className='text-3xl font-bold text-center pt-5'>Đánh giá</h1>
      <div className='px-6'>
        <button className={`bg-gray-300 p-2 mr-3 rounded-lg ${feedback == 'Tốt' ? 'bg-green-500 text-white' : ''}`} onClick={e => setFeedback('Tốt')}>Tốt  <i className="pl-1 ri-thumb-up-fill"></i> </button>
        <button className={`bg-gray-300 p-2 mr-3 rounded-lg ${feedback == 'Tệ' ? 'bg-red-500 text-white' : ''}`} onClick={e => setFeedback('Tệ')}>Tệ  <i className="pl-1 ri-thumb-down-fill"></i> </button>
        <button className={`bg-gray-300 p-2 mr-3 rounded-lg ${feedback == '' ? 'bg-green-500 text-white' : ''}`} onClick={e => setFeedback('')}>Tất cả </button> 
      </div>
      {/* Hiển thị các đánh giá */}
      <div className="mt-6 px-6 min-h-[50vh]">
        {listReview.length === 0 ? (
          <p>Chưa có đánh giá nào</p>
        ) : (
          filterFacility()?.map((review, index) => 
             ((currentPage-1)*5 <= index && index < currentPage*5) ? (
            <div key={review.id} className=" shadow-gray-400 shadow-md mb-3 p-4 border-b border-gray-200">
              <p className='font-medium'>Khách hàng: {review.khachHang.ho_KH + ' ' + review.khachHang.ten_KH}</p>
              <p className='text-[11px] font-medium text-gray-700'>{review.ngayTao_DG}</p>
              <span
                className={`font-semibold ${review.danhGia === 'Tốt' ? 'text-green-500' : 'text-red-500'}`}
              >
                {review.danhGia} 
                { review.danhGia === 'Tốt' ?  <i className="pl-1 ri-thumb-up-fill"></i> : <i className="pl-1 ri-thumb-down-fill"></i>}
              </span>
              <p className="text-gray-700">{review.noiDung}</p>
            </div>
          ): '') 
        )}
      </div>
      <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
    </div>
  )
}

// Component hiển thị từng sao
export default Review