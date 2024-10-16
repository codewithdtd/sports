import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import facilityService from '../services/facility.service'
import sportTypeService from '../services/sportType.service'
import Booking from '../services/booking.service'
import ServiceService from '../services/service.service'
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import FormService from '../components/FormService';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import FormComfirm from '../components/FormComfirm';

const BookingDetail = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [listFac, setListFac] = useState([]);
  const [field, setField] = useState({})
  const [booking, setBooking] = useState([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [checkedSlots, setCheckedSlots] = useState([]);
  const [bookingsByDate, setBookingsByDate] = useState({});
  const [listService, setListService] = useState([])
  const [modalConfirm, setModalConfirm] = useState(null);
  const [modalService, setModalService] = useState(null);
  const [validateDate, setValidateDate] = useState(false);
  const [submit, setSubmit] = useState(false);

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user.login.user);
  const accessToken = user?.accessToken;
  const { loai_san } = useParams(); 
  const startTime = 8; // 8:00
  const endTime = 22; // 22:00
  const interval = loai_san == 'Bóng đá' ?  1.5 : 1; // 1 giờ 30 phút
  
  const bookingService = new Booking(user, dispatch);
  const serviceService = new ServiceService(user, dispatch);
  
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
    const fields = await sportTypeService.get(loai_san);
    setField(fields)

    const date = {ngayDat: currentDate};
    let list = await facilityService.getAllBooked(date);
    list = list.filter(fac => fac.loai_San.ten_loai === fields.ten_loai)
    setListFac(list)

    const service = await serviceService.getAll();
    setListService(service)
  }

  // Xử lý đặt sân
  const handleBooking = (data, checked) => {
    const key = `${data.san._id}_${data.thoiGianBatDau}_${data.ngayDat}`;  // Tạo key duy nhất cho mỗi sân và thời gian
    if (checked) {
      if(data.ngayDat < getCurrentDate()) {
        setValidateDate(true)
        return;
      }
      setValidateDate(false)
      // Thêm phần tử vào danh sách đặt sân và đánh dấu slot này đã được check
      setBooking(prevBooking => [...prevBooking, data]);
      setCheckedSlots(prevCheckedSlots => [...prevCheckedSlots, key]);
    } else {
      // Xóa phần tử khỏi danh sách đặt sân và bỏ đánh dấu slot đã được check
      setBooking(prevBooking => prevBooking.filter(item => !(item.thoiGianBatDau === data.thoiGianBatDau && item.san._id === data.san._id && item.ngayDat === data.ngayDat)));
      // setCheckedSlots(prevCheckedSlots => prevCheckedSlots.filter(slot => slot !== key));
      setCheckedSlots(prevCheckedSlots => 
        prevCheckedSlots.filter(slot => {
          return slot !== key
        }) 
      );
    }
  };

  const handleService = (data) => {
    setBooking(prevBooking => 
      prevBooking.map(item => 
        item._id === data._id ? data : item
      )
    );
  }


  const handleSubmit = async (infoUser) => {
    // e.preventDefault();
    if(!user) {
      // toast.error("Vui lòng đăng nhập để đặt sân", {
      // });
      alert('Vui lòng đăng nhập để đặt sân')
      return;
    }
    try {
      setSubmit(true)
      for(const item of booking) {
        item.khachHang = infoUser
        await createBooking(item);
      }
      toast.success("Đặt sân thành công !", {
     
      });
      setTimeout(() => {
        navigate('/');  // Chuyển hướng sau 2 giây
      }, 2500);
    } catch (error) {
      toast.error("Đặt sân thất bại!", {
      });
      console.error("Có lỗi xảy ra khi đặt sân:", error);
      // Xử lý lỗi nếu cần, chẳng hạn hiển thị thông báo
    }
  }

  const createBooking = async (data) => {
    try {
      data.thanhTien = data.thanhTien + (data.dichVu?.reduce((a, c) => a + c.thanhTien, 0) || 0)
      const result = await bookingService.create(data, accessToken);
      if (result) {
        return result;  // Trả về kết quả nếu thành công
      }
    } catch (error) {
      console.error('Lỗi khi đặt sân:', error);
      throw error;  // Ném lỗi để xử lý trong hàm gọi
    }
  }

  function getCurrentDate() {
    const today = new Date();
    
    const year = today.getFullYear(); // Lấy năm
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng (bắt đầu từ 0 nên cần +1) và định dạng thành 2 chữ số
    const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày và định dạng thành 2 chữ số

    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng yyyy-mm-dd
  }

  function getCurrentTime() {
    const today = new Date();
    
    const hour = today.getHours(); 
    const minute = today.getMinutes();
    return `${hour}:${minute}`; // Trả về chuỗi theo định dạng yyyy-mm-dd
  }

  const handleDate= (date) => {
    if(date >= getCurrentDate()) {
      setValidateDate(false)
      setCurrentDate(date)
    }
    else {
      setValidateDate(true)
    }
  }

  // useEffect(()=> {
  //   setBooking([]);
  //   setCheckedSlots([]);
  //   getFacility()
  // }, [currentDate])

  useEffect(() => {
    // Lưu trạng thái trước khi thay đổi currentDate
    if (booking.length > 0 || checkedSlots.length > 0) {
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
    if (field.hinhAnh && field.hinhAnh.length > 0) {
      let loadedImages = 0;

      field.hinhAnh.forEach((item) => {
        const img = new Image();
        img.src = `http://localhost:3000/uploads/${item}`;
        img.onload = () => {
          loadedImages += 1;
          if (loadedImages === field.hinhAnh.length) {
            setImagesLoaded(true);  // Khi tất cả ảnh đã tải xong
          }
        };
        img.onerror = () => {
          console.error(`Không thể tải ảnh: ${item}`);
        };
      });
    }
  }, [field.hinhAnh]);

  useEffect(() => {
    if (bookingsByDate[currentDate]) {
      console.log(bookingsByDate[currentDate])
      // setBooking(bookingsByDate[currentDate].booking);
      setCheckedSlots(bookingsByDate[currentDate].checkedSlots);  // checkedSlots bao gồm san._id
    } else {
      // setBooking([]);
      setCheckedSlots([]);
    }

    // getFacility();
  }, [currentDate]);

  useEffect(() => {
    // Gọi getFacility sau khi checkedSlots được cập nhật
    getFacility();
  }, []);


  const buttonStyle = {
      // width: "15px",
      "fontSize": '30px',
      // height: "30px",
      'justifyContent': 'center',
      'alignItems': 'center',
      'borderRadius': '100%',
      display: 'flex',
      'zIndex': '1',
      background: 'rgb(218 218 218)',
      height: '40px',
      width: '40px',
      border: '0px'
  };

  const properties = {
      prevArrow: <button style={{ ...buttonStyle }}><i className="ri-arrow-drop-left-line"></i></button>,
      nextArrow: <button style={{ ...buttonStyle }}><i className="ri-arrow-drop-right-line"></i></button>
  }

  return (
    <div className='m-3 p-4 border-2 border-gray-400 bg-white rounded-lg shadow-lg shadow-gray-400'>
      <ToastContainer autoClose='2000' />
      <div className='mb-3 text-blue-600 font-bold'>
        <Link to={'/booking'}>{'< '}Quay lại</Link>
      </div>
      <div className=''>
        {imagesLoaded ? (
          <Slide {...properties} slidesToScroll={1} slidesToShow={4} indicators={true}>
            {field.hinhAnh?.map((item, index) => (
              <div key={index} className='w-full px-3 flex justify-center'>
                <img
                  key={item}
                  src={`http://localhost:3000/uploads/${item}`}
                  className='px-2 object-cover w-full h-full aspect-[3/2]'
                  alt=""
                />
              </div>
            ))}
          </Slide>
        ) : (
          <p>Đang tải ảnh...</p>
        )}
      </div>
      <form className='flex flex-col md:flex-row gap-3' action="" onSubmit={e => handleSubmit(e)}>
        <div className='flex-1'>
          <h1 className='text-center text-blue-500 font-bold text-3xl uppercase'>
            {field.ten_loai}
          </h1>
          <div className='flex justify-between'>
            <div>
              <input type="date" min={getCurrentDate()} className={`border border-gray-400 rounded-md p-1 ${validateDate ? 'bg-red-300': ''}`} value={currentDate} onChange={e => handleDate(e.target.value)} />
              {validateDate ? <p className='text-red-600'>Chọn ngày hiện tại trở lên</p> : ''}
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
          </div>
          <div className='h-[45vh] md:h-[65vh] overflow-y-scroll'>
            <div className='flex border-b-2 text-center py-2 border-gray-400'>
              <div className='w-1/6 font-bold'>Bắt đầu</div>
              <div className='w-1/6 font-bold'>Kết thúc</div>
              <div className='flex-1 font-bold'>Sân</div>
              <div className='flex-1 font-bold'>Giá</div>
              <div className='flex-1 font-bold'>Tình trạng</div>
              <div className='mx-4'></div>
            </div>
            {timeSlots.map((slot, index) => 
            (currentDate === getCurrentDate() ? 
              (slot.formattedTimeStart > getCurrentTime()) : true) 
              ? 
            <div className={`flex items-center border-b text-center border-gray-400`} key={index}>
              <div className='w-1/6'>
                {slot.formattedTimeStart}
              </div>
              <div className='w-1/6'>
                {slot.formattedTimeEnd}
              </div>
              <div className="flex-1">
                {listFac?.map((san) => 
                <div className={`flex py-2 border border-gray-400 hover:bg-gray-300
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
                        // khachHang: user.user,
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
            : '')}
            { currentDate === getCurrentDate() && timeSlots.every(slot => slot.formattedTimeStart < getCurrentTime()) ? 
              <p>Đã hết giờ đặt sân của ngày hôm nay vui lòng chọn ngày khác để đặt sân !!!</p> : ''
            }
          </div>
        </div>
        <div className='flex flex-col flex-1 pt-1'>
          Sân đã chọn:
          <div className="flex-1 overflow-y-scroll border-2 px-2 min-h-60 md:max-h-[65vh] max-h-80 border-gray-400 rounded-lg">
            {booking?.map((bk, index) => 
              <div key={index} className='flex flex-col justify-around'>
                <div className='flex py-2 justify-around items-center border-b border-gray-400'>
                  <p>{bk.ngayDat}</p>
                  <p>{bk.thoiGianBatDau} - {bk.thoiGianKetThuc}</p>
                  <p>{bk.san.ten_San}</p>
                  <p>{formatNumber(bk.thanhTien || 0)}</p>
                  <button type='button' onClick={e=> setModalService(bk)} className='border border-blue-600 p-1 rounded-md text-blue-600 hover:text-white hover:bg-blue-500'>Thêm dịch vụ</button>
                </div>
                {bk.dichVu?.map((dichVu, index) => 
                  <div key={dichVu._id} className='ml-7 flex border-b text-center justify-between p-2 border-l-2 border-gray-400'>
                    <p className='flex-1'>{dichVu.ten_DV}</p>
                    <p className='flex-1'>x {dichVu.soluong}</p>
                    <p className='flex-1'>{formatNumber(dichVu.thanhTien)}</p>
                  </div>
                 )} 
                {modalService ? <FormService toggle={setModalService} service={modalService} allService={listService} setService={setListService} handle={handleService} /> : ''}
              </div>
            )}
          </div>
          
          <p>Tổng tiền: <b>{formatNumber(booking.reduce((a, c) => {
              const tienSan = c.san?.bangGiaMoiGio || 0; // Tiền sân
              const tienDichVu = c.dichVu?.reduce((bd, kt) => bd + (kt.thanhTien || 0), 0) || 0; // Tiền dịch vụ
              return a + tienSan + tienDichVu;
            }, 0))}</b>
          </p>
          {/* <button type={`${submit ? 'button' : ''}`} className='bg-blue-500 p-1 px-3 rounded-lg text-white font-bold'>Xác nhận</button> */}
          <button type={`button`} className='bg-blue-500 p-1 px-3 rounded-lg text-white font-bold' onClick={e => booking.length > 0 && setModalConfirm(true)}>Xác nhận</button>
        </div>
            
      </form>
          {modalConfirm && booking.length > 0 ? <FormComfirm data={booking} toggle={setModalConfirm} user={user.user} submit={handleSubmit} /> : ''}
    </div>
  )
}

export default BookingDetail