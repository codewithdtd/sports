import React, { useState, useEffect } from 'react'
import FacilityService from '../services/facility.service';
import ServiceService from '../services/service.service';
import UserService from '../services/user.service';
import SportTypeService from '../services/sportType.service';
import FormService from './FormService';
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ViewBookingTime(props) {
  const [data, setData] = useState(props.data);
  const [list, setList] = useState([]);
  const [fieldBooked, setFieldBooked] = useState([]);
  const [listBooked, setListBooked] = useState(null);
  const [filter, setFilter] = useState('Bóng đá');
  const [listSelected, setListSelected] = useState([]);
  const [listService, setListService] = useState(null)
  const [listServiceSelected, setListServiceSelected] = useState([])
  const [listUser, setListUser] = useState([])
  const [chooseUser, setChooseUser] = useState(false)
  const [missError, setMissError] = useState(false)
  const [checkedSlots, setCheckedSlots] = useState([]);
  const [bookingsByDate, setBookingsByDate] = useState({});
  const [booking, setBooking] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [modalService, setModalService] = useState(null)
  const [listSportType, setListSportType] = useState(null)
  const [fieldChange, setFieldChange] = useState(null)
  const [validateDate, setValidateDate] = useState(false)
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.login.user);

  const facilityService = new FacilityService(user, dispatch);
  const serviceService = new ServiceService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch);
  const userService = new UserService(user, dispatch);

  const startTime = 8; // 8:00
  const endTime = 22; // 22:00
  const interval = filter == 'Bóng đá' ? 1 : 1; // 1 giờ 30 phút

  const timeSlots = [];

  // Dùng vòng lặp để tạo các thời gian với khoảng cách 1 giờ 30 phút
  for (let time = startTime; time <= endTime && (time + interval) <= endTime; time += interval) {
    // Lấy giờ và phút
    const hour = Math.floor(time);
    const minute = (time % 1) * 60;

    // Láy giờ phút kết thúc
    const hourEnd = Math.floor(time + interval);
    const minuteEnd = ((time + interval) % 1) * 60;
    // Format lại giờ cho đẹp
    const formattedTimeStart = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : minute}`;
    const formattedTimeEnd = `${hourEnd.toString().padStart(2, '0')}:${minuteEnd === 0 ? '00' : minuteEnd}`;
    // Tạo thời gian và thêm vào mảng
    timeSlots.push({ formattedTimeStart, formattedTimeEnd });
  }

  const [time, setTime] = useState({
    ngayDat: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  // Lấy thời gian hiện tại
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




  // lấy dữ liệu sân
  const getFacility = async () => {
    const allField = await facilityService.getAll();
    setList(allField);
    const field = await facilityService.getAllBooked({ ngayDat: currentDate });
    setFieldBooked(field);
    const user = await userService.getAll();
    setListUser(user);
    const services = await serviceService.getAll();
    setListService(services);
    const sportType = await sportTypeService.getAll();
    setListSportType(sportType);
  }
  // Lấy dữ liệu sân đã đặt
  const getFacilityBooked = async () => {
    const field = await facilityService.getAllBooked({ ngayDat: currentDate });
    setListBooked(field);
  }


  // ,Phần ngàn
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // chuyển ngày thấng năm
  function convertDateFormat(dateStr) {
    // Tách chuỗi ngày thành các phần ngày, tháng, năm
    const [day, month, year] = dateStr.split('/');

    // Ghép lại theo định dạng mm-dd-yyyy
    return `${year}-${month}-${day}`;
  }
  // Lọc sân
  const convertString = () => {
    return list.map((item) => {
      const { ten_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item;
      return [ten_San, item.loai_San.ten_loai, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterList = () => {
    let filteredList = [];

    filteredList = list;
    if (filter !== '') {
      const terms = filter.toLowerCase().split(' ');
      const convertedStrings = convertString();
      filteredList = filteredList.filter((item, index) =>
        // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
        terms.every(term =>
          convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
        )
      );
    }

    // if (listBooked) {
    //   filteredList = filteredList.filter(item =>
    //     !listBooked.some(booked => booked._id === item._id)
    //   );
    // }

    return filteredList;
  }

  // Tính giờ
  function calculateTimeDifference(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    const differenceInMinutes = endInMinutes - startInMinutes;

    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;

    return parseFloat(differenceInMinutes / 60).toFixed(2);
  }

  // Xử lý dich vụ
  // const getService = async () => {
  //   const services = await serviceService.getAll();
  //   setListService(services);
  // }

  const addSelected = (ser) => {
    // Tính toán danh sách mới trước khi gọi setListServiceSelected
    const updatedList = listServiceSelected.map(item => {
      // Tìm nếu đối tượng đã tồn tại trong mảng
      if (item._id === ser._id && item.ma_San === ser.ma_San) {
        return { ...item, soluong: item.soluong + 1 }; // Tăng số lượng nếu tồn tại
      }
      return item;
    });

    // Nếu đối tượng không tồn tại, thêm nó vào danh sách
    if (!listServiceSelected.some(item => item._id === ser._id && item.ma_San === ser.ma_San)) {
      ser.soluong = 1;
      updatedList.push(ser);
    }

    // Cập nhật state với danh sách mới
    setListServiceSelected(updatedList);


    // Bây giờ bạn có thể console.log(updatedList) để thấy danh sách mới ngay lập tức


    setData({ ...data, thanhTien: data.thanhTien + ser.gia })
  }
  const removeSelected = (ser) => {
    if (ser.ma_San) {
      // Xóa phần tử có cả `_id` và `ma_San` trùng với `ser`
      setListServiceSelected(listServiceSelected.filter(item => (
        item._id !== ser._id || item.ma_San !== ser.ma_San
      )));
    } else {
      // Nếu không có `ma_San`, chỉ xóa phần tử dựa vào `_id`
      setListServiceSelected(listServiceSelected.filter(item => (
        item._id !== ser._id
      )));
    }
    // const thanhTien = listServiceSelected.reduce((a, c) => a + c.thanhTien, 0)
    setData({ ...data, thanhTien: data.thanhTien - ser.thanhTien })
  }

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    setListServiceSelected(prevList =>
      prevList.map(item => {
        if (item._id === id) {
          // Cập nhật lại `thanhTien`
          setData(prevData => ({
            ...prevData,
            thanhTien: prevData.thanhTien + (newQuantity - item.soluong) * item.gia
          }));
          const updatedItem = { ...item, soluong: newQuantity }; // Cập nhật số lượng mới


          return updatedItem; // Trả về item đã cập nhật
        }
        return item; // Giữ nguyên các item khác
      })
    );
  };

  const handleBooking = (data, checked) => {
    const key = `${data.san._id}_${data.thoiGianBatDau}_${data.ngayDat}`;  // Tạo key duy nhất cho mỗi sân và thời gian
    if (checked) {
      if (data.ngayDat < getCurrentDate()) {
        setValidateDate(true)
        return;
      }
      setValidateDate(false)
      // Thêm phần tử vào danh sách đặt sân và đánh dấu slot này đã được check
      if (props.data._id) {
        setBooking([])
        // setFieldChange(data)
        setData({ ...props.data, san: data.san, thoiGianBatDau: data.thoiGianBatDau, thoiGianKetThuc: data.thoiGianKetThuc, ngayDat: data.ngayDat })
      }
      // setBooking([...booking, data]);
      // setCheckedSlots([...checkedSlots, key]);
      setBooking(prevBooking => [
        ...prevBooking.filter(item => !(item.thoiGianBatDau === data.thoiGianBatDau && item.san._id === data.san._id && item.ngayDat === data.ngayDat)),
        data
      ]);
      setCheckedSlots(prevCheckedSlots => [
        ...prevCheckedSlots.filter(slot => slot !== key),
        key
      ]);
    } else {
      // Xóa phần tử khỏi danh sách đặt sân và bỏ đánh dấu slot đã được check
      setBooking(booking.filter(item => !(item.thoiGianBatDau === data.thoiGianBatDau && item.san._id === data.san._id && item.ngayDat === data.ngayDat)));
      setCheckedSlots(checkedSlots.filter(slot => slot !== key));
    }
  };

  const handleService = (data) => {
    setBooking(prevBooking =>
      prevBooking.map(item =>
        item._id === data._id ? data : item
      )
    );
  }

  const checkValidateDate = (date) => {
    if (date >= getCurrentDate()) {
      console.log(date)
      setCurrentDate(date)
    } else
      setValidateDate(true)
  }

  useEffect(() => {
    setData(props.data);
    // if(data._id != '')
    //   setFilter(data.san.loai_San);
    getFacility();
    console.log(props.data)
    if (props.data?.ngayDat) {
      setCurrentDate(convertDateFormat(props.data.ngayDat))
      // if (booking.length || checkedSlots?.length)
      // setBookingsByDate(prev => ({
      //   ...prev,
      //   [currentDate]: {
      //     booking,
      //     checkedSlots
      //   }
      // }))
      console.log(checkedSlots)
    }
    // getService();
  }, [props.data, currentDate]);

  useEffect(() => {
    // Lưu trạng thái trước khi thay đổi currentDate
    if (booking?.length || checkedSlots?.length) {
      setBookingsByDate(prev => ({
        ...prev,
        [currentDate]: {
          booking,
          checkedSlots
        }
      }));
    }
  }, [currentDate, checkedSlots]);


  useEffect(() => {
    if (bookingsByDate[currentDate]) {
      // setBooking(bookingsByDate[currentDate].booking);
      console.log('true')
      setCheckedSlots(bookingsByDate[currentDate]?.checkedSlots);  // checkedSlots bao gồm san._id
    } else {
      // setBooking([]);
      console.log('false')
      setCheckedSlots([]);
    }
    getFacility();
  }, [currentDate]);

  useEffect(() => {
    filterList();
  }, [list])
  useEffect(() => {
    console.log("Change Time")
    if (time.ngayDat != '') {
      getFacilityBooked();
    }
  }, [time, currentDate]);

  return (
    <div className='absolute z-20 bg-opacity-30 bg-black flex top-0 left-0 w-full h-full' onClick={e => props.toggle(false)}>
      <ToastContainer autoClose={2000} />
      <form action="" className='relative flex flex-col bg-white p-2 px-6 w-11/12 max-h-[98%] overflow-y-scroll max-w-[98%] rounded-md m-auto' onClick={e => e.stopPropagation()}>
        <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
        <h1 className='text-center text-2xl font-bold p-5'>LỊCH ĐẶT</h1>


        {/* {!data._id ?  */}
        <div className='lg:pl-6 border-gray-400 w-full'>

          <div className='flex gap-2'>
            <div className='flex-1 text-sm'>
              <div className='flex justify-between py-1'>
                <h1 className='font-bold'>Chọn sân</h1>

                <select name="filter" id="" onChange={e => setFilter(e.target.value)} className='bg-gray-300 rounded-md border border-gray-400'>
                  <option value={filter}>{filter}</option>
                  {listSportType?.map(sportType =>
                    <option key={sportType._id} value={sportType.ten_loai}>{sportType.ten_loai}</option>
                  )}
                </select>


              </div>
              <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2'>
                <div className='flex-1'>
                  <div className='flex justify-between'>
                    <div>
                      <input type="date" className={`border rounded-md p-1 ${validateDate ? 'border-red-400 bg-red-100' : 'border-gray-400'}`} value={currentDate} onChange={e => setCurrentDate(e.target.value)} />
                      {validateDate ? <p className='text-red-500'>Vui lòng chọn ngày chính xác</p> : ''}
                    </div>
                    {/* <div>
                            <p className='border border-gray-400 rounded-md p-1 px-2'>Tuần</p>
                          </div> */}
                  </div>
                  <div className='max-h-[65vh] overflow-y-scroll'>
                    <div className='flex border-b-2 text-center py-2 border-gray-400'>
                      <div className='w-1/6 font-bold'>Bắt đầu</div>
                      <div className='w-1/6 font-bold'>Kết thúc</div>
                      <div className='flex-1 font-bold'>Sân</div>
                      <div className='flex-1 font-bold'>Giá</div>
                      <div className='flex-1 font-bold'>Tình trạng</div>
                      {/* <div className='mx-4'></div> */}
                    </div>
                    {timeSlots.map((slot, index) =>
                      <div className={`flex items-center border-b text-center border-gray-400`} key={index}>
                        <div className='w-1/6'>
                          {slot.formattedTimeStart}
                        </div>
                        <div className='w-1/6'>
                          {slot.formattedTimeEnd}
                        </div>
                        <div className="flex-1">
                          {/* {filterList()?.map((san) =>
                            <div className={`flex py-2 border border-gray-400
                                  ${(san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd)
                                || (san.tinhTrang == 'Bảo trì')
                                ? 'bg-blue-300' : ''
                              }
                                `}
                              key={san._id}
                            >
                              <div className="flex-1">
                                {san.ten_San}
                              </div>
                              <div className="flex-1">{formatNumber(san.bangGiaMoiGio || 0)}</div>
                              <div className="flex-1">
                                {
                                  (san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd)
                                    ? 'Đã đặt' : (san.tinhTrang == 'Bảo trì') ? san.tinhTrang : 'Trống'
                                }
                              </div>
                            </div>
                          )} */}
                          {filterList()?.map((san) => {
                            // Lọc các phần tử trùng _id trong fieldBooked
                            console.log(slot.formattedTimeStart)
                            const matchedFields = fieldBooked?.filter(
                              (field) =>{
                                return (field._id === san._id &&
                                field.datSan?.thoiGianBatDau === slot.formattedTimeStart &&
                                field.datSan?.thoiGianKetThuc === slot.formattedTimeEnd)
                              }
                            );
                            // Kiểm tra điều kiện trùng thời gian
                            const isTimeConflict = matchedFields?.length > 0;

                            // Kiểm tra trạng thái bảo trì
                            const isUnderMaintenance = san.tinhTrang === "Bảo trì";

                            return (
                              <div
                                className={`flex py-2 border border-gray-400 ${isTimeConflict || isUnderMaintenance ? "bg-blue-300" : ""
                                  }`}
                                key={san._id}
                              >
                                <div className="flex-1">{san.ten_San}</div>
                                <div className="flex-1">{formatNumber(san.bangGiaMoiGio || 0)}</div>
                                <div className="flex-1">
                                  {isTimeConflict
                                    ? "Đã đặt"
                                    : isUnderMaintenance
                                      ? san.tinhTrang
                                      : "Trống"}
                                </div>
                              </div>
                            );
                          })}


                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ViewBookingTime