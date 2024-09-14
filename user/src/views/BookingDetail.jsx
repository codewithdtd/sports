import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import facilityService from '../services/facility.service'
import bookingService from '../services/booking.service'
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';


const BookingDetail = () => {
  const [listFac, setListFac] = useState([]);
  const [booking, setBooking] = useState([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [checkedSlots, setCheckedSlots] = useState([]);
  const [bookingsByDate, setBookingsByDate] = useState({});

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.login.user);
  const accessToken = user?.accessToken;
  const { loai_san } = useParams(); 
  const startTime = 8; // 8:00
  const endTime = 22; // 22:00
  const interval = loai_san == 'Bóng đá' ?  1.5 : 1; // 1 giờ 30 phút

  const timeSlots = [];

  // Dùng vòng lặp để tạo các thời gian với khoảng cách 1 giờ 30 phút
  for (let time = startTime; time <= endTime && (time+interval) <= endTime ; time += interval) {
    // Lấy giờ và phút
    const hour = Math.floor(time);
    const minute = (time % 1) * 60;

    // Láy giờ phút kết thúc
    const hourEnd = Math.floor(time+interval);
    const minuteEnd = ((time+interval) % 1) * 60;
    // Format lại giờ cho đẹp
    const formattedTimeStart = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : minute}`;
    const formattedTimeEnd = `${hourEnd.toString().padStart(2, '0')}:${minuteEnd === 0 ? '00' : minuteEnd}`;
    // Tạo thời gian và thêm vào mảng
    timeSlots.push({formattedTimeStart,formattedTimeEnd});
  }
  function getCurrentDate() {
    const today = new Date();
    
    const year = today.getFullYear(); // Lấy năm
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng (bắt đầu từ 0 nên cần +1) và định dạng thành 2 chữ số
    const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày và định dạng thành 2 chữ số

    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng yyyy-mm-dd
 }
  // định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

// Cơ sở dữ liệu
  const getFacility = async () => {
    const date = {ngayDat: currentDate};
    let list = await facilityService.getAllBooked(date);
    list = list.filter(fac => fac.loai_San === loai_san)
    setListFac(list)
  }

  // Xử lý đặt sân
  const handleBooking = (data, checked) => {
    const key = `${data.san._id}_${data.thoiGianBatDau}_${data.ngayDat}`;  // Tạo key duy nhất cho mỗi sân và thời gian

    if (checked) {
      // Thêm phần tử vào danh sách đặt sân và đánh dấu slot này đã được check
      setBooking([...booking, data]);
      setCheckedSlots([...checkedSlots, key]);
    } else {
      // Xóa phần tử khỏi danh sách đặt sân và bỏ đánh dấu slot đã được check
      setBooking(booking.filter(item => !(item.thoiGianBatDau === data.thoiGianBatDau && item.san._id === data.san._id && item.ngayDat === data.ngayDat)));
      setCheckedSlots(checkedSlots.filter(slot => slot !== key));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for(const item of booking) {
        await createBooking(item);
      }
      toast.success("Đặt sân thành công !", {
        position: "top-center"
      });
      setTimeout(() => {
        navigate('/');  // Chuyển hướng sau 2 giây
      }, 2500);
    } catch (error) {
      toast.error("Đặt sân thất bại!", {
        position: "top-center"
      });
      console.error("Có lỗi xảy ra khi đặt sân:", error);
      // Xử lý lỗi nếu cần, chẳng hạn hiển thị thông báo
    }
  }

  const createBooking = async (data) => {
    try {
      const result = await bookingService.create(data, accessToken);
      if (result) {
        return result;  // Trả về kết quả nếu thành công
      }
    } catch (error) {
      console.error('Lỗi khi đặt sân:', error);
      throw error;  // Ném lỗi để xử lý trong hàm gọi
    }
  }

  // useEffect(()=> {
  //   setBooking([]);
  //   setCheckedSlots([]);
  //   getFacility()
  // }, [currentDate])

  useEffect(() => {
    // Lưu trạng thái trước khi thay đổi currentDate
    if (booking.length || checkedSlots.length) {
      setBookingsByDate(prev => ({
        ...prev,
        [currentDate]: {
          booking,
          checkedSlots
        }
      }));
    }
  }, [currentDate, booking, checkedSlots]);


  useEffect(() => {
    if (bookingsByDate[currentDate]) {
      // setBooking(bookingsByDate[currentDate].booking);
      setCheckedSlots(bookingsByDate[currentDate].checkedSlots);  // checkedSlots bao gồm san._id
    } else {
      // setBooking([]);
      setCheckedSlots([]);
    }

    getFacility();
  }, [currentDate]);



  return (
    <div className='m-3 p-4 border-2 border-gray-400 bg-white rounded-lg shadow-lg shadow-gray-400'>
      <ToastContainer autoClose='2000' />
      <form className='flex flex-col md:flex-row gap-3' action="" onSubmit={e => handleSubmit(e)}>
        <div className='flex-1'>
          <h1 className='text-center text-green-500 font-bold text-3xl uppercase'>
            {loai_san}
          </h1>
          <div className='flex justify-between'>
            <div>
              <input type="date" className='border border-gray-400 rounded-md p-1' value={currentDate} onChange={e => setCurrentDate(e.target.value)} />
              {/* <select className='mx-4 border border-gray-400 rounded-md p-1' name="" id="">
                <option value="">Bắt đầu</option>
                {timeSlots.map((slot, index) => 
                  <option value="">{slot.formattedTimeStart}</option>
                )}
              </select> 
              <select className='border border-gray-400 rounded-md p-1' name="" id="">
                <option value="">Kết thúc</option>
                {timeSlots.map((slot, index) => 
                  <option value="">{slot.formattedTimeEnd}</option>
                )}
              </select> */}
            </div>
            <div>
              <p className='border border-gray-400 rounded-md p-1 px-2'>Tuần</p>
            </div>
          </div>
          <div className='h-[50vh] md:h-[65vh] overflow-y-scroll'>
            <div className='flex border-b-2 text-center py-2 border-gray-400'>
              <div className='w-1/6 font-bold'>Bắt đầu</div>
              <div className='w-1/6 font-bold'>Kết thúc</div>
              <div className='flex-1 font-bold'>Sân</div>
              <div className='flex-1 font-bold'>Giá</div>
              <div className='flex-1 font-bold'>Tình trạng</div>
              <div className='mx-4'></div>
            </div>
            {timeSlots.map((slot, index) => (
            <div className={`flex items-center border-b text-center border-gray-400`} key={index}>
              <div className='w-1/6'>
                {slot.formattedTimeStart}
              </div>
              <div className='w-1/6'>
                {slot.formattedTimeEnd}
              </div>
              <div className="flex-1">
                {listFac?.map((san) => 
                <div className={`flex py-2 border border-gray-400
                    ${
                      san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd
                      ? 'bg-gray-300' : ''
                    }
                  `} 
                  key={san._id}
                >
                  <div className="flex-1">
                    {san.ten_San }
                  </div>
                  <div className="flex-1">{formatNumber(san.bangGiaMoiGio || 0)}</div>
                  <div className="flex-1">
                    {
                      san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd
                      ? 'Đã đặt' : 'Trống'
                    }
                  </div>
                  <div className='mx-2'>
                    {/* <button type='button'
                      onClick={e => handleBooking({
                        thoiGianBatDau: slot.formattedTimeStart,
                        thoiGianKetThuc: slot.formattedTimeEnd,
                        khachHang: user.user,
                        san: san,
                        ngayDat: currentDate,
                        thanhTien: san.bangGiaMoiGio
                      })}
                    >
                      <i class="ri-add-circle-fill"></i>
                    </button> */}
                    <input type="checkbox" className='w-5 h-5' 
                      checked={checkedSlots.includes(`${san._id}_${slot.formattedTimeStart}_${currentDate}`)} 
                      onChange={e => handleBooking({
                        thoiGianBatDau: slot.formattedTimeStart,
                        thoiGianKetThuc: slot.formattedTimeEnd,
                        khachHang: user.user,
                        san: san,
                        ngayDat: currentDate,
                        thanhTien: san.bangGiaMoiGio
                      }, e.target.checked)}
                      disabled={san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd}
                    />
                  </div>
                </div>
                )}
              </div>
            </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col flex-1 pt-1'>
          Sân đã chọn:
          <div className="flex-1 overflow-y-scroll border-2 px-2 min-h-60 border-gray-400 rounded-lg">
            {booking?.map((bk, index) => 
              <div key={index} className='flex justify-around border-b border-gray-400'>
                <p>{bk.ngayDat}</p>
                <p>{bk.thoiGianBatDau} - {bk.thoiGianKetThuc}</p>
                <p>{bk.san.ten_San}</p>
                <p>{formatNumber(bk.thanhTien || 0)}</p>
              </div>
            )}
          </div>
          <p>Tổng tiền: <b>{formatNumber(booking.reduce((a, c) => a + c.san.bangGiaMoiGio, 0))}</b></p>
          <button className='bg-green-500 p-1 px-3 rounded-lg text-white font-bold'>Xác nhận</button>
        </div>
      </form>
    </div>
  )
}

export default BookingDetail