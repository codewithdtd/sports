import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reviewService from '../services/review.service'
const Feedback = (props) => {
  const [feedback, setFeedback] = useState(''); // Tùy chọn "Tốt" hoặc "Tệ"
  const [comment, setComment] = useState(''); // Bình luận
  const [reviewed, setReviewed] = useState(null); // Danh sách các đánh giá
  const user = useSelector((state)=> state.user.login.user)

  // Xử lý khi chọn "Tốt" hoặc "Tệ"
  const handleFeedbackChange = (type) => {
    setFeedback(type);
  };

  // Gửi đánh giá mới
  const submitReview = () => {
    if (feedback && comment) {
      const newReview = {
        danhGia: feedback,
        noiDung: comment,
        khachHang: user?.user,
        datSan: props.data,
      };
      if(createReview(newReview)) { // Thêm đánh giá mới
        setFeedback(''); // Reset lại tùy chọn
        setComment('');
        props.toggle(false) // Reset bình luận
      }
    } else {
      alert("Vui lòng chọn phản hồi và nhập bình luận.");
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
        const datSan = { 'datSan._id': id }
        const review = await reviewService.getOne(datSan)
        if(review) {
            handleFeedbackChange(review.danhGia)
            setReviewed(review);
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if(props.data._id) {
        getReview(props.data._id);
    }
  },[])



  return (
    <div className='absolute bg-black bg-opacity-80 w-full h-full top-0 flex' onClick={e => props.toggle(false)}>
        <div className="max-w-md min-w-[50%] relative m-auto p-6 bg-white rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <h2 className="text-xl font-bold mb-4">Đánh giá của bạn</h2>
            {!reviewed ?
            <div>
                {/* Lựa chọn giữa "Tốt" và "Tệ" */}
                <div className="flex justify-center mb-4">
                    <button
                    className={`mr-4 px-4 py-2 rounded-lg ${feedback === 'Tốt' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFeedbackChange('Tốt')}
                    >
                    Tốt <i className="pl-1 ri-thumb-up-fill"></i>
                    </button>
                    <button
                    className={`px-4 py-2 rounded-lg ${feedback === 'Tệ' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFeedbackChange('Tệ')}
                    >
                    Tệ <i className="pl-1 ri-thumb-down-fill"></i>
                    </button>
                </div>
                <p className='pb-2'>{props.data.san.ten_San}</p>
                {/* Form nhập bình luận */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn"
                    rows={4}
                    maxLength={200}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
                />
            </div>

            :
                <div>
                    <div className="flex justify-center mb-4">
                    <button
                    className={`mr-4 px-4 py-2 rounded-lg ${feedback === 'Tốt' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                    Tốt <i className="pl-1 ri-thumb-up-fill"></i>
                    </button>
                    <button
                    className={`px-4 py-2 rounded-lg ${feedback === 'Tệ' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                    Tệ <i className="pl-1 ri-thumb-down-fill"></i>
                    </button>
                </div>
                <p className='pb-2'>{props.data.san.ten_San}</p>
                {/* Form nhập bình luận */}
                <textarea
                    value={reviewed.noiDung}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
                    disabled
                />
            </div>
            }



            {/* Nút gửi đánh giá */}
            { !reviewed ?  
            <button
                onClick={submitReview}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Gửi đánh giá
            </button>  
            : '' }      
        </div>
    </div>
  );
};

export default Feedback;
