import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FromFacility from '../components/FromFacility';
import invoiceService from '../services/invoice.service';
import bookingService from '../services/booking.service';
import facilityService from '../services/facility.service';

function Facility() {
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  // xử lý sân đã đặt
  
  const [fac, setFac] = useState({
    _id: null,
    datSan: {},
    nhanVien: {},
    dichVu: [],
    thoiGianCheckIn: '',
    thoiGiaCheckOut: '',
    bangGiaMoiGio: 0,
    ghiChu: '',
    phuongThucThanhToan: '',
    giamGia: 0,
    tongTien: 0
  });
  const [search, setSearch] = useState('');
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [currentDate, setCurrentDate] = useState(getFormattedDate());


  const backgroundSan = (data) => {
    switch (data) {
      case 'Bóng đá':
        return './src/assets/img/football.png';
      case 'Bóng rổ':
        return './src/assets/img/basketball-ball.png';
      case 'Bóng chuyền':
        return './src/assets/img/volleyball-ball.png';
      case 'Cầu lông':
        return './src/assets/img/shuttlecock.png';
      default: 
        break;
    }
  } 

  const handleFacility = async (data = {}) => {
    setFac(data) 
    console.log(data)
      
    if(data.phuongThuc == 'edit') {
      console.log('edit')
      if(await editBooing(data))
        console.log('Đã cập nhật');
    }
    if(data.phuongThuc == 'thanhToan') {
      console.log('check out')
      if(await createFacility(data))
        console.log('check out');
    }
    setEdit(!edit);  
  };
  // định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return facilities.map((item) => {
      const { ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item;
      return [ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if(search == '') 
      return facilities;


    const searchTerms = search.toLowerCase().split(' ');
    const convertedStrings = convertString();
    console.log(convertedStrings)
    const filteredFacilities = facilities.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      )
    );
    return filteredFacilities;
  }


  // Hàm để lấy giờ hiện tại và định dạng thành 'HH:MM'
  function getFormattedTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
      // return "17:00";
  }

  // Hàm để lấy ngày hiện tại và định dạng thành 'dd/mm/yyyy'
  function getFormattedDate() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng 0-11, cần +1
      const year = now.getFullYear();
      return `${year}-${month}-${day}`;
      // return `2024-09-04`;
  }


  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getFacility = async () => {
    const data = await facilityService.getAll();
    setFacilities(data);
    console.log('tải lại')
  }
    // Lấy dữ liệu sân đã đặt
  const getFacilityBooked = async () => {
    const time = {
      ngayDat: currentDate,
      thoiGianBatDau: currentTime,
      thoiGianKetThuc: ''
    };
    try {
      const field = await facilityService.getAllBookedExact(time);
      setFacilities(field);

      if (field && facilities.length > 0) {
        facilities.forEach(async (facility) => {
          // Kiểm tra xem id của facility có trong field không
          if (facility.datSan && facility.datSan.thoiGianBatDau == currentTime && facility.tinhTrang == "Trống") {
            facility.tinhTrang = 'Đã đặt';
          }

          // Cập nhật facility mà không cần trả về
          await editFacility(facility);
        });
      }
    } catch (error) {
      console.error('Error fetching or updating facilities:', error);
    }
  }
  // Kiểm tra xem có đúng giờ đặt trước chưa nếu có chuyển trạng thái sang đã đặt


  const createFacility = async (data) => {
    // const newFac = await facilityService.create(data);
    const newInvoice = {
      datSan: data.datSan,
      nhanVien: user
    }
    // const newInvoice = await invoiceService.create(data);
    return newFac;  
  }
  const editFacility = async (data) => {
    const editFac = await facilityService.update(data._id, data);
    // console.log(data)
    return editFac;
  }

  const editBooing = async (data) => {
      console.log('have datSan')
      const editBoooking = await bookingService.update(data.datSan._id, data.datSan);
  } 
  const deleteFacility = async (data) => {
    const deleteFac = await facilityService.delete(data._id);
    return deleteFac;
  }

  useEffect(() => {
    getFacility();
    getFacilityBooked();
    console.log(1)
  }, [fac]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setCurrentDate(getFormattedDate());
    }, 1000); // 60000ms = 1 phút

    // Dọn dẹp bộ đếm thời gian khi component bị unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='facility'>
      <Header name="Sân thể thao" />
      <div className="flex justify-between mb-3">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
         
          <div className="bg-green-500 cursor-pointer hover:bg-green-700 ml-2 max-w-50% shadow-gray-700 shadow-sm text-white overflow-hidden rounded-lg p-2" onClick={e => setFilter(!filter)}>
            <i className="ri-arrow-down-double-line"></i>
            Lọc
          </div>
          {filter ? 
          <div className='bg-white z-10 shadow-black shadow-sm rounded-md p-2 h-fit flex flex-col top-full right-0 absolute justify-around'>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="">
              <option value="">Loại sân</option>
              <option value="">Bóng đá</option>
              <option value="">Bóng chuyền</option>
              <option value="">Cầu lông</option>
            </select>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="">
              <option value="">Tình trạng</option>
              <option value="">Trống</option>
              <option value="">Đã đặt trước</option>
              <option value="">Đang sử dụng</option>
              <option value="">Bảo trì</option>
              <option value="">Quá hạn</option>
            </select>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="">
              <option value="">Giá</option>
              <option value="">{'<'} 100.000</option>
              <option value="">100.000 - 200.000</option>
              <option value="">200.000 - 400.000</option>
              <option value="">{'>'} 400.000</option>
            </select>
            <button className='bg-green-500 text-white px-2 py-1 text-sm cursor-pointer hover:bg-green-700 m-auto rounded-md' onClick={e => setFilter(!filter)}>Xác nhận</button>
          </div>
        : '' }
        </div> 
        {/* <button className="bg-green-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-green-700 w-10 h-10 m-auto rounded-xl"
                onClick={e => handleFacility()}
        >
          +
        </button> */}
      </div>
      <div className='flex pb-2'>
        <div className='flex items-center'>
          <input name='' className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' type="date" value={currentDate} readOnly/>
        </div>
        <div className='flex items-center'>
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' value={currentTime} readOnly />
        </div>
        {/* <div className='flex items-center'>
          Đến:
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' />
        </div> */}
      </div>
      {/* Lọc dữ liệu */}
      
      {/* Phân chia xem hiển thị dạng grid hay bảng */}
      
      
        <div className='grid grid-cols-3 lg:grid-cols-5 gap-4'>
        {facilities ? filterFacility().map((facility, index) => 
          <div 
            key={facility._id} 
            className={`${facility.tinhTrang == "Trống" ? 'bg-white' : facility.tinhTrang == "Đã đặt" ? 'bg-blue-500' : 'bg-green-500'} shadow-lg shadow-slate-500 rounded-lg overflow-hidden transition-all cursor-pointer hover:-translate-y-1`}
            onClick={e => handleFacility(facility)}
          >  
            <div className={`px-1 text-sm flex justify-between `}>
              <p>{facility.ma_San}</p>
              <p>{facility.datSan ? facility.datSan.khachHang.ho_KH+' '+facility.datSan.khachHang.ten_KH : ''}</p>
            </div>
            <div className='bg-white relative facility-item-name pl-1 min-h-24 sm:min-h-28 md:h-36 justify-center items-center bg-no-repeat bg-center flex text-lg font-extrabold'>
              <img src={backgroundSan(facility.loai_San)} className='absolute w-1/3 z-[0] opacity-50' alt="" /> 
              <p className='text-3xl z-[1] xl:text-4xl italic'>{facility.tinhTrang}</p>
            </div>
            <div className='z-10 text-sm sm:text-base px-1 sm:flex justify-between'>
              {facility.datSan ? facility.datSan.thoiGianBatDau+'-'+facility.datSan.thoiGianKetThuc : facility.ten_San} 
              <p>{facility.datSan ? formatNumber(facility.datSan.thanhTien) : formatNumber(facility.bangGiaMoiGio)+"/h"}</p>
            </div>
          </div>
          ) : ''}
        </div>
        {/* from nhập dữ liệu */}
      {edit ? <FromFacility toggle={setEdit} handleData={handleFacility} data={fac} /> : '' }
    </div>
  )
}

export default Facility