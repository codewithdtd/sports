import React, { useState, useEffect } from 'react'
import facilityService from '../services/facility.service';
import serviceService from '../services/service.service';
import userService from '../services/user.service';

function FromBooking(props) {
  const [data, setData] = useState(props.data);
  const [list, setList] = useState([]);
  const [listBooked, setListBooked] = useState(null);
  const [filter, setFilter] = useState('');
  const [listSelected, setListSelected] = useState([]);
  const [listServiceSelected, setListServiceSelected] = useState([])
  const [listUser, setListUser] = useState([])
  const [chooseUser, setChooseUser] = useState(false)

  const [time, setTime] = useState({
    ngayDat: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    data._id ? data.phuongThuc = 'edit' : data.phuongThuc = 'create';
    
    if(listSelected.length > 0) 
      data.san = listSelected;
      // setData({...data, thanhTien: calculateTimeDifference(data.thoiGianBatDau, data.thoiGianKetThuc)})
    props.handleData(data); // Xử lý dữ liệu biểu mẫ
    setListSelected([]);
  };

  const addFac = (payload) => {
    payload.thoiGianBatDau = time.thoiGianBatDau;
    payload.thoiGianKetThuc = time.thoiGianKetThuc;
    payload.ngayDat = time.ngayDat;
    payload.thanhTien = payload.bangGiaMoiGio*calculateTimeDifference(time.thoiGianBatDau, time.thoiGianKetThuc);
    const thanhTien = data.thanhTien + payload.bangGiaMoiGio*calculateTimeDifference(time.thoiGianBatDau, time.thoiGianKetThuc);
    setListSelected([...listSelected, payload]);
    setList(list.filter(item => item.ma_San !== payload.ma_San))
    setData({...data, thanhTien: thanhTien})
  }
  const removeFac = (payload) => {
    setListSelected(listSelected.filter(facility => facility.ma_San !== payload.ma_San));
    setList([...list, payload]);
    setData({...data, thanhTien: data.thanhTien-payload.bangGiaMoiGio*calculateTimeDifference(time.thoiGianBatDau, time.thoiGianKetThuc)})
  }
  
  // lấy dữ liệu sân
  const getFacility = async () => {
    const field = await facilityService.getAll();
    setList(field);
    const user = await userService.getAll();
    setListUser(user);
    if(data._id) {
      setTime({
        ngayDat: convertDateFormat(data.ngayDat),
        thoiGianBatDau: data.thoiGianBatDau,
        thoiGianKetThuc: data.thoiGianKetThuc
      })
    }
  }
  // Lấy dữ liệu sân đã đặt
  const getFacilityBooked = async () => {
    const field = await facilityService.getAllBooked(time);
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
      const { ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item;
      return [ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterList = () => {
    let filteredList = [];
    if (time.ngayDat && time.thoiGianBatDau && time.thoiGianKetThuc)
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

    if (listBooked) {
      filteredList = filteredList.filter(item =>
        !listBooked.some(booked => booked._id === item._id)
      );
    }

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

    return parseFloat(differenceInMinutes/60).toFixed(2);
  }

  // Xử lý dich vụ
//  const getService = async () => {
//     const services = await serviceService.getAll();
//     setListService(services);
//   }

  const addSelected = (data) => {
    setListServiceSelected((prevList) => {
      // Kiểm tra xem đối tượng đã tồn tại trong mảng hay chưa
      const existingItem = prevList.find(item => item._id === data._id);

      if (existingItem) {
        // Nếu đối tượng đã tồn tại, tăng số lượng lên 1
        return prevList.map(item => 
          item._id === data._id 
            ? { ...item, soluong: item.soluong + 1 }
            : item
        );
      } else {
        // Nếu đối tượng chưa tồn tại, thêm đối tượng mới với số lượng là 1
        data.soluong = 1;
        return [...prevList, data];
      }
    });
  }
  const removeSelected = (data) =>{
    setListServiceSelected(listServiceSelected.filter(item => item._id !== data._id));
  }
  useEffect(() => {
    setData(props.data);
    // if(data._id != '')
    //   setFilter(data.san.loai_San);
    getFacility();
    // getService();
  }, [props.data]);
  
  useEffect(() => {
    filterList();
  }, [list])
  useEffect(() => {
    console.log("Change Time")
    if (time.ngayDat !='' && time.thoiGianBatDau!='' && time.thoiGianKetThuc !='') {
      getFacilityBooked();
    }
  }, [time]);

  return (
    <div className='absolute bg-opacity-30 bg-black -translate-x-2 flex top-0 w-full h-full' onClick={e => props.toggle(false)}>
        <form action="" className='relative flex flex-col bg-white p-2 px-6 w-fit max-h-[98%] overflow-y-scroll max-w-[98%] rounded-md m-auto' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
          <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
          <h1 className='text-center text-2xl font-bold p-5'>THÔNG TIN</h1>
          <div className={`flex flex-col lg:flex-row`}> 
            <div className='booking-customer lg:max-w-max mr-6'>  
              { data._id == '' ?
              <div className='flex justify-between mb-2'>
                <p className={`border-2 border-gray-400 p-1 px-2 rounded-lg cursor-pointer ${chooseUser == false ? 'bg-green-500 text-white' : ''}`} onClick={e => setChooseUser(false)}>Khách mới</p>
                <p className={`border-2 border-gray-400 p-1 px-2 rounded-lg cursor-pointer ${chooseUser == true ? 'bg-green-500 text-white' : ''}`} onClick={e => setChooseUser(true)}>Khách cũ</p>
              </div> : ''
              }
            {!chooseUser ?  
            <div>
              <div className='flex justify-between'>
                  <div className="flex flex-1">
                    <i className="mr-1 ri-user-3-fill"></i>
                    <input name='' className='w-1/2 flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.ho_KH} placeholder='Họ' onChange={e => setData({...data, khachHang: {...data.khachHang, ho_KH: e.target.value}})}/>
                  </div>
                  <div className="flex flex-1">
                    <i className="mr-1 ri-user-3-fill"></i>
                    <input name='' className='w-1/2 flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.ten_KH} onChange={e => setData({...data, khachHang: {...data.khachHang, ten_KH: e.target.value}})} placeholder='Tên'/>
                  </div>
                </div>
                <div className="flex">
                  <i className="mr-1 ri-mail-line"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.email_KH} onChange={e => setData({...data, khachHang: {...data.khachHang, email_KH: e.target.value}})} placeholder='Email (nếu có)'/>
                </div>
                <div className="flex">
                  <i className="mr-1 ri-phone-line"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khachHang.sdt_KH} onChange={e => setData({...data, khachHang: {...data.khachHang, sdt_KH: e.target.value}})} placeholder='Số điện thoại'/>
                </div>
              </div>
              : 
              <div className='flex'>
                <i className="mr-1 ri-user-3-fill"></i>
                <select name="" id="" 
                  className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2'
                  onChange={e => {
                    const selectedUser = listUser.find(user => user._id === e.target.value);
                    setData({...data, khachHang: selectedUser});
                  }}
                >
                  {listUser?.map(item => {
                    return <option value={item._id}>{item.ho_KH} {item.ten_KH} {item.sdt_KH}</option>
                  })}
                </select>
              </div>
              }
                <div className="flex">
                  <i className="mr-1 ri-shield-user-fill text-lg"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.hoiVien} onChange={e => setData({...data, hoiVien: e.target.value})} placeholder='Hội viên'/>
                </div>
                <div className="flex">
                  <i className="mr-1 ri-sticky-note-line"></i>
                  <input name='' className=' flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ghiChu} onChange={e => setData({...data, ghiChu: e.target.value})} placeholder='Ghi chú'/>
                </div>
                <div className="flex">
                  <i className="mr-1 ri-money-dollar-circle-fill text-lg"></i>
                  <input name='' readOnly className=' flex-1 border font-bold border-gray-400 mb-2 rounded-xl p-1 pl-2' type="number" value={data.san.bangGiaMoiGio*calculateTimeDifference(time.thoiGianBatDau, time.thoiGianKetThuc)} onChange={e => setData({...data, thanhTien: e.target.value})} placeholder='Tổng tiền'/>
                </div>
                <div className={`${!data.trangThai ? 'hidden' : ''} flex font-bold ${data.trangThai == 'Đã hủy' ? 'text-red-500' : ''}`}>
                  <i className={data.trangThai == 'Đã hủy' ? 'mr-1 ri-close-line' : 'mr-1 ri-check-double-line'}></i>
                  <select name="" id="" className='flex-1 border font-bold border-gray-400 mb-2 rounded-xl p-1 pl-2' onChange={e => setData({...data, trangThai: e.target.value})}>
                    {/* <option value={data.trangThai}>{data.trangThai}</option> */}
                    <option value='Đã duyệt'>Đã duyệt</option>
                    <option value='Nhận sân'>Nhận sân</option>
                    <option value='Đã thanh toán'>Đã thanh toán</option>
                    <option value='Đã hủy'>Đã hủy</option>
                  </select>
                </div>
              </div>
      
            
            {/* {!data._id ?  */}
            <div className='lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 border-t pt-6 border-gray-400 w-full'>
              <div className='flex justify-center'>
                <div className='flex items-center'>
                  <i className="mr-1 ri-calendar-event-fill"></i>
                  <input name='' className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' type="date" value={time.ngayDat} onChange={e => setTime({...time, ngayDat: e.target.value})} />
                </div>
                <div className='flex items-center'>
                  Từ:
                  <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' value={time.thoiGianBatDau} onChange={e => setTime({...time, thoiGianBatDau: e.target.value})} />
                </div>
                <div className='flex items-center'>
                  Đến:
                  <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' value={time.thoiGianKetThuc} onChange={e => setTime({...time, thoiGianKetThuc: e.target.value})} />
                </div>
              </div>
              
              {!data._id ? 
                <div className='flex gap-2 pt-2'>
                  <div className='flex-1'>
                    <div className='flex justify-between py-1'>
                      <h1 className='font-bold'>Chọn sân</h1>
           
                      <select name="filter" id="" onChange={e => setFilter(e.target.value)} className='bg-gray-300 rounded-md border border-gray-400'>
                        <option value="Chọn sân">Chọn sân</option>
                        <option value="Bóng đá">Bóng đá</option>
                        <option value="Bóng chuyền">Bóng chuyền</option>
                        <option value="Bóng rổ">Bóng rổ</option>
                        <option value="Cầu lông">Cầu lông</option>
                      </select>
                    
      
                    </div>
                    <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2 h-36 overflow-y-scroll'>
                    {time.ngayDat && time.thoiGianBatDau && time.thoiGianKetThuc ?
                      filterList().map(facility => {
                        return <div key={facility._id} className='border-b hover:bg-gray-200 border-gray-300 p-1 flex items-center'>
                                  <p className='w-1/4 inline-block'>{facility.ma_San}</p>
                                  <div className='w-3/5 pl-1 inline-block'>
                                    <p>{facility.ten_San}</p>
                                    <p>{formatNumber(facility.bangGiaMoiGio)}/giờ</p>
                                  </div>
                                  <i className="ml-1 ri-add-circle-fill text-lg text-green-600 cursor-pointer hover:scale-125" onClick={e => addFac(facility)}></i>
                              </div>
                      }) : 'Vui lòng nhập ngày, giờ để xem sân trống !!!'
                    }
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h1 className='font-bold py-1'>Đã chọn</h1>
                    <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 pl-2 h-36 overflow-y-scroll'>
                    {
                      listSelected.map(facility => {
                        return <div key={facility._id} className='border-b hover:bg-gray-200 border-gray-300 p-1 flex items-center'>
                                  <p className='w-1/4 inline-block'>{facility.ma_San}</p>
                                  <div className='w-3/5 pl-1 inline-block'>
                                    <p>{facility.ten_San}</p>
                                    <p>{formatNumber(facility.bangGiaMoiGio)}/giờ</p>
                                  </div>
                                  <i className="ml-1 ri-close-circle-fill text-lg text-red-600 cursor-pointer hover:scale-125" onClick={e => removeFac(facility)}></i>
                              </div>
                      })
                    }
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
                        <option value="Chọn sân">Chọn sân</option>
                        <option value="Bóng đá">Bóng đá</option>
                        <option value="Bóng chuyền">Bóng chuyền</option>
                        <option value="Bóng rổ">Bóng rổ</option>
                        <option value="Cầu lông">Cầu lông</option>
                      </select>
                    
      
                    </div>
                    <div name="" id="" className='flex-1 border border-gray-400 mb-2 rounded-xl p-1 h-40 pl-2 overflow-y-scroll'>
                    {time.ngayDat && time.thoiGianBatDau && time.thoiGianKetThuc ?
                      filterList().map(facility => {
                        return <div key={facility._id} className='border-b hover:bg-gray-200 border-gray-300 p-1 flex items-center'>
                                  <p className='w-1/4 inline-block'>{facility.ma_San}</p>
                                  <div className='w-3/5 pl-1 inline-block'>
                                    <p>{facility.ten_San}</p>
                                    <p>{formatNumber(facility.bangGiaMoiGio)}/giờ</p>
                                  </div>
                                  <input type="radio" name="changeField" class="w-5 h-5" onChange={e => setData({...data, san: facility})}/>
                           
                              </div>
                      }) : 'Vui lòng nhập ngày, giờ để xem sân trống !!!'
                    }
                    </div>
                    

                  </div>
                </div>
             
                }    
             
            </div>
             
              {/* <div>Sân
                 <div className='border border-gray-400 flex justify-around text-center'>
                   <p className='px-1 border border-gray-400'>{data.san.ma_San}</p>
                   <p className='px-1 border border-gray-400 flex-1'>{data.san.ten_San}</p>
                   <p className='px-1 border border-gray-400 flex-1'>{data.thoiGianBatDau} - {data.thoiGianKetThuc}</p>
                   <p className='px-1 border border-gray-400'>{data.ngayDat}</p>
                 </div>
               </div>  */}
         
            

          </div>
        <button className='bg-green-600 m-4 py-1 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
      </form>
    </div>
  )
}

export default FromBooking