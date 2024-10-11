import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewService from '../services/review.service'
const FormReview = (props) => {
  const [feedback, setFeedback] = useState(''); // Tùy chọn "Tốt" hoặc "Tệ"
  const [comment, setComment] = useState(''); // Bình luận
  const [reviewed, setReviewed] = useState(null); // Danh sách các đánh giá
  const [reviewedRes, setReviewedRes] = useState(null); // Danh sách các đánh giá
  const user = useSelector((state)=> state.user.login.user)
  const dispatch = useDispatch();
  const reviewService = new ReviewService(user, dispatch)
  // Xử lý khi chọn "Tốt" hoặc "Tệ"
  const handleFeedbackChange = (type) => {
    setFeedback(type);
  };

  // Gửi đánh giá mới
  const submitReview = () => {
    if (comment) {
      const newReview = {
        danhGia: feedback,
        noiDung: comment,
        phanHoi: reviewed,
        khachHang: user?.user,
      };
      if(createReview(newReview)) { // Thêm đánh giá mới
        setComment('');
        props.toggle(false) // Reset bình luận
      }
    } else {
      alert("Vui lòng nhập bình luận.");
    }
  };

  const createReview = async (data) => {
    try {
        const review = await reviewService.create(data);
        return review;
    } catch (error) {
        console.log(error)
    }
  }

  const getReview = async (id) => {
    try {
        const review = await reviewService.get(id)
        const reviewRes = await reviewService.getOne({ 'phanHoi._id': id })
        if(review) {
            // handleFeedbackChange(review.danhGia)
            setReviewed(review);
        }
        if(reviewRes) {
            // handleFeedbackChange(review.danhGia)
            setReviewedRes(reviewRes);
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    getReview(props.data._id);
  },[])



  return (
    <div className='absolute bg-black bg-opacity-80 w-full h-full left-0 top-0 flex' onClick={e => props.toggle(false)}>
        <div className="max-w-md min-w-[50%] relative m-auto p-6 bg-white rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
                <div>
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className='font-medium'>{reviewed?.khachHang.ho_KH} {reviewed?.khachHang.ten_KH}</p>
                            <p className='font-bold text-gray-600 text-sm'>{reviewed?.ngayTao_DG}</p>
                        </div>
                        <div>
                            <button
                            className={`mr-4 px-4 py-2 rounded-lg ${reviewed?.danhGia === 'Tốt' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            >
                            Tốt <i className="pl-1 ri-thumb-up-fill"></i>
                            </button>
                            <button
                            className={`px-4 py-2 rounded-lg ${reviewed?.danhGia === 'Tệ' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            >
                            Tệ <i className="pl-1 ri-thumb-down-fill"></i>
                            </button>
                        </div>
                    </div>
                {/* Form nhập bình luận */}
                <textarea
                    value={reviewed?.noiDung}
                    placeholder="Nhập bình luận của bạn"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
                    disabled
                />
            </div>
            <h2 className="text-xl font-bold mb-4">Phản hồi</h2>
            <div>
                <div>
                    <p className='font-medium'>{reviewedRes?.khachHang.ho_NV} {reviewedRes?.khachHang.ten_NV}</p>
                    <p className='font-bold text-gray-600 text-sm'>{reviewedRes?.ngayTao_DG}</p>
                </div>
                {/* Form nhập bình luận */}
                <textarea
                    value={reviewedRes?.noiDung}
                    disabled = {reviewedRes?.noiDung}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập phản hồi của bạn"
                    rows={4}
                    maxLength={200}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
                />
            </div>




            {/* Nút gửi đánh giá */}
            { !reviewedRes ? 
            <button
                onClick={submitReview}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
                Gửi
            </button>     
            : ''}
        </div>
    </div>
  );
};

export default FormReview;