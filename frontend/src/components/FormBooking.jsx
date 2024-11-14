import React, { useState, useEffect } from 'react'
import FacilityService from '../services/facility.service';
import ServiceService from '../services/service.service';
import UserService from '../services/user.service';
import SportTypeService from '../services/sportType.service';
import TimeService from '../services/time.service';
import FormService from './FormService';
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function FromBooking(props) {
  const [data, setData] = useState(props.data);
  const [list, setList] = useState([]);
  const [listBooked, setListBooked] = useState(null);
  const [filter, setFilter] = useState(props.data._id ? props.data.san.loai_San.ten_loai : 'Bóng đá');
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
  const [startTime, setStartTime] = useState(8)
  const [endTime, setEndTime] = useState(22)
  const [validateDate, setValidateDate] = useState(false)
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.login.user);

  const facilityService = new FacilityService(user, dispatch);
  const serviceService = new ServiceService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch);
  const userService = new UserService(user, dispatch);
  const timeService = new TimeService(user, dispatch);

  // const startTime = 8; // 8:00
  // const endTime = 22; // 22:00
  const interval = filter == 'Bóng đá' ? 1.5 : 1; // 1 giờ 30 phút

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


  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    if (props.data.trangThai === 'Hoàn thành') {
      toast.warning('Không được phép chỉnh sửa!')
      setBooking([])
      setListSelected([]);
      return;
    }
    if (booking.length <= 0) {
      console.log('miss');
      setMissError(true)
      return;
    }
    if (validateDate) {
      console.log('ngày lỗi')
      return;
    }


    data._id ? data.phuongThuc = 'edit' : data.phuongThuc = 'create';
    // data.dichVu = listServiceSelected;
    if (!data._id)
      if (booking.length > 0)
        for (const item of booking) {
          item.phuongThuc = 'create'
          item.khachHang = customer;
          const tienSan = item.san?.bangGiaMoiGio || 0; // Tiền sân
          const tienDichVu = item.dichVu?.reduce((bd, kt) => bd + (kt.thanhTien || 0), 0) || 0; // Tiền dịch vụ
          item.thanhTien = tienSan + tienDichVu;
          props.handleData(item); // Xử lý dữ liệu biểu mẫ
        }
    if (data._id) {
      data.phuongThuc = 'edit'
      const tienSan = data.san?.bangGiaMoiGio || 0; // Tiền sân
      const tienDichVu = data.dichVu?.reduce((bd, kt) => bd + (kt.thanhTien || 0), 0) || 0; // Tiền dịch vụ
      data.thanhTien = tienSan + tienDichVu;
      props.handleData(data); // Xử lý dữ liệu biểu mẫ

    }
    // setData({...data, thanhTien: calculateTimeDifference(data.thoiGianBatDau, data.thoiGianKetThuc)})
    // props.handleData(data); // Xử lý dữ liệu biểu mẫ
    setBooking([])
    setListSelected([]);
  };


  // lấy dữ liệu sân
  const getFacility = async () => {
    const field = await facilityService.getAllBooked({ ngayDat: currentDate });
    setList(field);
    const user = await userService.getAll();
    setListUser(user);
    const services = await serviceService.getAll();
    setListService(services);
    const sportType = await sportTypeService.getAll();
    setListSportType(sportType);
    if (data._id) {
      setBooking([data])
    }
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

  const handleChangeField = (data) => {
    const key = `${data.san._id}_${data.thoiGianBatDau}_${data.ngayDat}`;  // Tạo key duy nhất cho mỗi sân và thời gian
    if (props.data._id) {
      setBooking([])
      // setFieldChange(data)
      setData({ ...props.data, san: data.san, thoiGianBatDau: data.thoiGianBatDau, thoiGianKetThuc: data.thoiGianKetThuc, ngayDat: data.ngayDat, hanhDong: 'Đổi sân' })
    }
    // setBooking([...booking, data]);
    // setCheckedSlots([...checkedSlots, key]);
    setBooking(prevBooking => [
      ...prevBooking.filter(item => !(item.thoiGianBatDau === data.thoiGianBatDau && item.san._id === data.san._id && item.ngayDat === data.ngayDat)),
      data
    ]);
  }

  const handleService = (data) => {
    setBooking(prevBooking =>
      prevBooking.map(item =>
        item._id === data._id ? data : item
      )
    );
  }
  const getTime = async () => {
    const fetchTime = await timeService.getAll();
    const convertTimeToDecimal = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour + minute / 60;
    };
    setStartTime(convertTimeToDecimal(fetchTime[0].thoiGianMoCua));
    setEndTime(convertTimeToDecimal(fetchTime[0].thoiGianDongCua));
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
    getTime();
    // getService();
  }, [props.data]);

  useEffect(() => {
    // Lưu trạng thái trước khi thay đổi currentDate
    if (booking?.length || checkedSlots?.length || props.data._id) {
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
    if (time.ngayDat != '' && time.thoiGianBatDau != '' && time.thoiGianKetThuc != '') {
      getFacilityBooked();
    }
  }, [time]);

  return (
    <div className='absolute z-20 bg-opacity-30 bg-black flex top-0 left-0 w-full h-full' onClick={e => props.toggle(false)}>
      <ToastContainer autoClose={2000} />
      <form action="" className='relative flex flex-col bg-white p-2 px-6 w-11/12 max-h-[98%] overflow-y-scroll max-w-[98%] rounded-md m-auto' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
        <h1 className='text-center text-2xl font-bold p-5'>THÔNG TIN</h1>
        <div className={`flex flex-col lg:flex-row`}>
          <div className='booking-customer lg:max-w-max mr-6'>
            {!data._id ?
              <div className='flex justify-between mb-2'>
                <p className={`border-2 border-gray-400 p-1 px-2 rounded-lg cursor-pointer ${chooseUser == false ? 'bg-blue-500 text-white border-blue-700' : ''}`} onClick={e => setChooseUser(false)}>Khách mới</p>
                <p className={`border-2 border-gray-400 p-1 px-2 rounded-lg cursor-pointer ${chooseUser == true ? 'bg-blue-500 text-white border-blue-700' : ''}`} onClick={e => setChooseUser(true)}>Khách cũ</p>
              </div> : ''
            }
            {!chooseUser ?
              <div>
                <div className='flex justify-between'>
                  <div className="flex flex-1">
                    <i className="mr-1 ri-user-3-fill"></i>
                    <input required name='' className='w-1/2 flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.ho_KH} placeholder='Họ' onChange={e => setData({ ...data, khachHang: { ...data.khachHang, ho_KH: e.target.value } })} />
                  </div>
                  <div className="flex flex-1">
                    <i className="mr-1 ri-user-3-fill"></i>
                    <input required name='' className='w-1/2 flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.ten_KH} onChange={e => setData({ ...data, khachHang: { ...data.khachHang, ten_KH: e.target.value } })} placeholder='Tên' />
                  </div>
                </div>
                <div className="flex">
                  <i className="mr-1 ri-mail-line"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="email" value={data.khachHang.email_KH} onChange={e => setData({ ...data, khachHang: { ...data.khachHang, email_KH: e.target.value } })} placeholder='Email (nếu có)' />
                </div>
                <div className="flex">
                  <i className="mr-1 ri-phone-line"></i>
                  <input required name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.sdt_KH} onChange={e => setData({ ...data, khachHang: { ...data.khachHang, sdt_KH: e.target.value } })} placeholder='Số điện thoại' />
                </div>
              </div>
              :
              <div className='flex'>
                <i className="mr-1 ri-user-3-fill"></i>
                <select required name="" id=""
                  className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2'
                  onChange={e => {
                    let selectedUser = listUser.find(user => user._id === e.target.value);
                    if (selectedUser) {
                      const { matKhau_KH, ...other } = selectedUser
                      selectedUser = other;
                    }
                    setData({ ...data, khachHang: selectedUser });
                    setCustomer(selectedUser);
                  }}
                >
                  <option value="">Khách hàng</option>
                  {listUser?.map(item => {
                    return <option key={item._id} value={item._id}>{item.ho_KH} {item.ten_KH} {item.sdt_KH}</option>
                  })}
                </select>
              </div>
            }
            {/* <div className="flex">
                  <i className="mr-1 ri-shield-user-fill text-lg"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.hoiVien} onChange={e => setData({...data, hoiVien: e.target.value})} placeholder='Hội viên'/>
                </div> */}
            <div className="flex">
              <i className="mr-1 ri-sticky-note-line"></i>
              <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ghiChu} onChange={e => setData({ ...data, ghiChu: e.target.value })} placeholder='Ghi chú' />
            </div>
            {/* <div className="flex">
                  <i className="mr-1 ri-money-dollar-circle-fill text-lg"></i>
                  <input name='' readOnly className=' flex-1 border font-bold border-gray-400 mb-2 rounded-xl p-1 pl-2' 
                          type="number" value={data.thanhTien} 
                          onChange={e => setData({...data, thanhTien: e.target.value})}
                          placeholder='Tổng tiền'
                  />
                </div> */}
            <div className={`${!data.trangThai ? 'hidden' : ''} flex font-bold ${data.trangThai == 'Đã hủy' ? 'text-red-500' : ''}`}>
              <i className={data.trangThai == 'Đã hủy' ? 'mr-1 ri-close-line' : 'mr-1 ri-check-double-line'}></i>
              <select name="" id="" className='flex-1 border font-bold border-gray-400 mb-2 rounded-xl p-1 pl-2' onChange={e => setData({ ...data, trangThai: e.target.value })}>
                <option value={data.trangThai ? data.trangThai : ''}>{data.trangThai ? data.trangThai : 'Chọn'}</option>
                <option value='Đã duyệt'>Đã duyệt</option>
                <option value='Nhận sân'>Nhận sân</option>
                <option value='Hoàn thành'>Hoàn thành</option>
                <option value='Đã hủy'>Đã hủy</option>
              </select>
            </div>
          </div>


          {/* {!data._id ?  */}
          <div className='lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 border-t pt-6 border-gray-400 w-full'>

            {!data._id ?
              <div className='flex gap-2'>
                <div className='flex-1 text-sm'>
                  <div className='flex justify-between py-1'>
                    <h1 className='font-bold'>Chọn sân</h1>

                    <select name="filter" id="" onChange={e => setFilter(e.target.value)} className='bg-gray-300 rounded-md border border-gray-400'>
                      <option value="">Chọn sân</option>
                      {listSportType?.map(sportType =>
                        <option key={sportType._id} value={sportType.ten_loai}>{sportType.ten_loai}</option>
                      )}
                    </select>


                  </div>
                  <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2'>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <div>
                          <input min={getCurrentDate()} type="date" className={`border rounded-md p-1 ${validateDate ? 'border-red-400 bg-red-100' : 'border-gray-400'}`} value={currentDate} onChange={e => checkValidateDate(e.target.value)} />
                          {validateDate ? <p className='text-red-500'>Vui lòng chọn ngày chính xác</p> : ''}
                        </div>
                        {/* <div>
                            <p className='border border-gray-400 rounded-md p-1 px-2'>Tuần</p>
                          </div> */}
                      </div>
                      <div className='max-h-[35vh] overflow-y-scroll'>
                        <div className='flex border-b-2 text-center py-2 border-gray-400'>
                          <div className='w-1/6 font-bold'>Bắt đầu</div>
                          <div className='w-1/6 font-bold'>Kết thúc</div>
                          <div className='flex-1 font-bold'>Sân</div>
                          <div className='flex-1 font-bold'>Giá</div>
                          <div className='flex-1 font-bold'>Tình trạng</div>
                          <div className='mx-4'></div>
                        </div>
                        {timeSlots.map((slot, index) => (currentDate === getCurrentDate() ?
                          (slot.formattedTimeStart > getCurrentTime()) : true)
                          ? (
                            <div className={`flex items-center border-b text-center border-gray-400`} key={index}>
                              <div className='w-1/6'>
                                {slot.formattedTimeStart}
                              </div>
                              <div className='w-1/6'>
                                {slot.formattedTimeEnd}
                              </div>
                              <div className="flex-1">
                                {filterList()?.map((san) =>
                                  <div className={`flex py-2 border border-gray-400
                                  ${(san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd)
                                      || (san.tinhTrang == 'Bảo trì')
                                      ? 'bg-gray-300' : ''
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
                                    <div className='mx-2'>
                                      <input type="checkbox" className='w-5 h-5'
                                        checked={checkedSlots.includes(`${san._id}_${slot.formattedTimeStart}_${currentDate}`)}
                                        onChange={e => handleBooking({
                                          thoiGianBatDau: slot.formattedTimeStart,
                                          thoiGianKetThuc: slot.formattedTimeEnd,
                                          khachHang: customer,
                                          san: san,
                                          ngayDat: currentDate,
                                          thanhTien: san.bangGiaMoiGio
                                        }, e.target.checked)}
                                        disabled={(san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd) || (san.tinhTrang == 'Bảo trì')}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : '')}
                        {currentDate === getCurrentDate() && timeSlots.every(slot => slot.formattedTimeStart < getCurrentTime()) ?
                          <p className='p-2'>Đã hết giờ đặt sân của ngày hôm nay vui lòng chọn ngày khác để đặt sân !!!</p> : ''
                        }
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              :


              <div>
                <div className='flex-1'>

                  <div className='m-2 border border-gray-400 flex justify-around rounded-lg overflow-hidden text-center'>
                    <p className='p-2 border-r border-gray-400'>{data.san.ma_San}</p>
                    <p className='p-2 border-r border-gray-400 flex-1'>{data.san.ten_San}</p>
                    <p className='p-2 border-r border-gray-400 flex-1'>{data.thoiGianBatDau} - {data.thoiGianKetThuc}</p>
                    <p className='p-2 border-gray-400'>{data.ngayDat}</p>
                  </div>

                  <div className='flex justify-between py-1'>

                    <h1 className='font-bold'>ĐỔI SÂN</h1>
                    <select name="filter" id="" onChange={e => setFilter(e.target.value)} className='bg-gray-300 rounded-md border border-gray-400'>
                      <option value={''}>Chọn sân</option>
                      {listSportType?.map(sportType =>
                        <option key={sportType._id} value={sportType.ten_loai}>{sportType.ten_loai}</option>
                      )}
                    </select>


                  </div>
                  <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2'>
                    <div className='flex-1'>

                      <div className='flex justify-between'>
                        <div>
                          <input type="date" className={`border rounded-md p-1 ${validateDate ? 'border-red-400 bg-red-100' : 'border-gray-400'}`} value={currentDate} />
                          {validateDate ? <p className='text-red-500'>Vui lòng chọn ngày chính xác</p> : ''}
                        </div>
                        {/* <div>
                          <p className='border border-gray-400 rounded-md p-1 px-2'>Tuần</p>
                        </div> */}
                      </div>
                      <div className='max-h-[35vh] overflow-y-scroll'>
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
                              {filterList()?.map((san) =>
                                <div className={`flex py-2 border border-gray-400
                                ${san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd
                                    || (data.thoiGianBatDau <= slot.formattedTimeStart && data.thoiGianKetThuc >= slot.formattedTimeEnd && data.san._id == san._id)
                                    || (san.tinhTrang == 'Bảo trì')
                                    ? 'bg-gray-300' : ''
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
                                      san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd
                                        || (data.thoiGianBatDau <= slot.formattedTimeStart && data.thoiGianKetThuc >= slot.formattedTimeEnd && data.san._id == san._id)
                                        ? 'Đã đặt' : san.tinhTrang == 'Bảo trì' ? 'Bảo trì' : 'Trống'
                                    }
                                  </div>
                                  <div className='mx-2'>

                                    <input type="radio" className='w-5 h-5' name='change'
                                      // checked={checkedSlots.includes(`${san._id}_${slot.formattedTimeStart}_${currentDate}`)} 
                                      onChange={e => handleChangeField({
                                        thoiGianBatDau: slot.formattedTimeStart,
                                        thoiGianKetThuc: slot.formattedTimeEnd,
                                        khachHang: data.khachHang,
                                        san: san,
                                        ngayDat: currentDate,
                                        thanhTien: san.bangGiaMoiGio
                                      })}
                                      disabled={(san.datSan?.thoiGianBatDau <= slot.formattedTimeStart && san.datSan?.thoiGianKetThuc >= slot.formattedTimeEnd)
                                        || (data.thoiGianBatDau <= slot.formattedTimeStart && data.thoiGianKetThuc >= slot.formattedTimeEnd && data.san._id == san._id)
                                        || (san.tinhTrang == 'Bảo trì')
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            }


            <div className={`flex flex-col flex-1 pt-1`}>
              Sân đã chọn:
              <div className={`flex-1 overflow-y-scroll border-2 px-2 min-h-60 max-h-[35vh]  rounded-lg ${missError ? 'border-red-400 bg-red-100' : 'border-gray-400 '}`}>
                {missError ? <p className='text-red-600'>Chưa chọn sân</p> : ''}
                {booking?.map((bk, index) =>
                  <div key={index} className='flex flex-col justify-around'>
                    <div className='flex py-2 justify-around items-center border-b border-gray-400'>
                      <p>{bk.ngayDat}</p>
                      <p>{bk.thoiGianBatDau} - {bk.thoiGianKetThuc}</p>
                      <p>{bk.san.ten_San}</p>
                      <p>{formatNumber(bk.san.bangGiaMoiGio || 0)}</p>
                      <button type='button' onClick={e => setModalService(bk)} className='border border-blue-600 p-1 rounded-md text-blue-600 hover:text-white hover:bg-blue-500'>Thêm dịch vụ</button>
                    </div>
                    {!data._id ? bk.dichVu?.map((dichVu) =>
                      <div key={dichVu._id} className='ml-7 flex border-b text-center justify-between p-2 border-l-2 border-gray-400'>
                        <p className='flex-1'>{dichVu.ten_DV}</p>
                        <p className='flex-1'>x {dichVu.soluong}</p>
                        <p className='flex-1'>{formatNumber(dichVu.thanhTien)}</p>
                      </div>
                    )
                      : data.dichVu?.map((dichVu) =>
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
                const tienDichVu = c.dichVu?.reduce((bd, kt) => bd + (kt.thanhTien || 0), 0) || data.dichVu?.reduce((bd, kt) => bd + (kt.thanhTien || 0), 0) || 0;  // Tiền dịch vụ

                return a + tienSan + tienDichVu;
              }, 0))}</b>
              </p>
            </div>

          </div>
        </div>

        {(data?.trangThai !== 'Hoàn thành') ?
          <button className='bg-blue-600 m-4 py-1 rounded-lg text-white hover:bg-blue-500'>Xác nhận</button>
          : ''}
      </form>
    </div>
  )
}

export default FromBooking