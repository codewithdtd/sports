import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormFacility from '../components/FormFacility';
import InvoiceService from '../services/invoice.service';
import BookingService from '../services/booking.service';
import FacilityService from '../services/facility.service';
import SportTypeService from '../services/sportType.service';
import ServiceService from '../services/service.service';
import Pagination from '../components/Pagination';
import ChangeTime from '../components/ChangeTime';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Facility() {
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [sportType, setSportType] = useState([]);
  const [modalTime, setModalTime] = useState(false);
  const user = useSelector((state) => state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoiceService = new InvoiceService(user, dispatch);
  const bookingService = new BookingService(user, dispatch);
  const facilityService = new FacilityService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch);
  const serviceService = new ServiceService(user, dispatch);

  useEffect(() => {
    if (!user) {
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
  const [currentPage, setCurrentPage] = useState(1);


  const backgroundSan = (data) => {
    // switch (data) {
    //   case 'Bóng đá':
    //     return './src/assets/img/football.png';
    //   case 'Bóng rổ':
    //     return './src/assets/img/basketball-ball.png';
    //   case 'Bóng chuyền':
    //     return './src/assets/img/volleyball-ball.png';
    //   case 'Cầu lông':
    //     return './src/assets/img/shuttlecock.png';
    //   default: 
    //     break;
    // }
    const foundSport = sportType.find(item => item.ten_loai === data);
    return foundSport ? foundSport.hinhAnhDaiDien : null;
  }

  const handleFacility = async (data = {}) => {
    setFac(data)
    console.log(data)

    if (data.phuongThuc == 'edit') {
      console.log('edit')
      if (data.thoiGianCheckIn != '--:--') {
        data.tinhTrang = 'Đang sử dụng';
        await editFacility(data)
      }
      if (await editBooking(data))
        console.log('Đã cập nhật');
      toast.success('Cập nhật thành công');
      setFac(fac)
    }
    if (data.phuongThuc == 'thanhToan') {
      console.log('check out')
      if (window.confirm('Xác nhận trả sân')) {
        data.tinhTrang = "Trống";
        data.datSan.trangThai = "Hoàn thành";
        data.datSan.trangThaiThanhToan = 'Đã thanh toán';
        const bookingSuccess = await editBooking(data);
        const facilitySuccess = await editFacility(data);
        const invoiceSuccess = await createInvoice(data)
        if (data.datSan.dichVu?.length > 0) {
          for (let dichVu of data.datSan.dichVu) {
            const updateService = await editService(dichVu);
          }
        }
        toast.success('Trả sân thành công');
        setFac(fac)
      }
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
    if (search == '')
      return facilities;


    const searchTerms = search.toLowerCase().split(' ');
    const convertedStrings = convertString();
    const filteredFacilities = facilities.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      )
    );
    return filteredFacilities;
  }

  const totalPages = Math.ceil(filterFacility().length / 10);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm để lấy giờ hiện tại và định dạng thành 'HH:MM'
  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
    // return "21:12";
  }

  // Hàm để lấy ngày hiện tại và định dạng thành 'dd/mm/yyyy'
  function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng 0-11, cần +1
    const year = now.getFullYear();
    return `${year}-${month}-${day}`;
    // return `2024-09-07`;
  }


  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getFacility = async () => {
    let data = await facilityService.getAll();
    data = data.sort((a, b) => a.ten_San.localeCompare(b.ten_San));
    setFacilities(data);
    const sp = await sportTypeService.getAll()
    setSportType(sp)
    console.log('tải lại')
  }
  // Lấy dữ liệu sân đã đặt
  const getFacilityBooked = async () => {
    const time = {
      ngayDat: currentDate,
      thoiGian: currentTime,
      thoiGianKetThuc: ''
    };
    try {
      const field = await facilityService.getAllBookedExact(time);
      setFacilities(field.sort((a, b) => a.ten_San.localeCompare(b.ten_San)));

      if (field && facilities.length > 0) {
        facilities.forEach(async (facility) => {
          // Kiểm tra xem id của facility có trong field không
          if (facility.datSan && facility.datSan.trangThai != 'Nhận sân' && facility.tinhTrang == "Trống") {
            facility.tinhTrang = 'Đã đặt';
            await editFacility(facility);
          }
          // Cập nhật facility mà không cần trả về
          setFac(fac);
        });
      }
    } catch (error) {
      console.error('Error fetching or updating facilities:', error);
    }
  }
  // Kiểm tra xem có đúng giờ đặt trước chưa nếu có chuyển trạng thái sang đã đặt


  const createInvoice = async (data) => {
    const newInvoice = {
      nhanVien: user.user,
      khachHang: data.datSan.khachHang,
      datSan: data.datSan,
      phuThu: data.phuThu,
      ghiChu: data.datSan.ghiChu,
      phuongThucThanhToan: data.phuongThucThanhToan,
      tongTien: data.datSan.thanhTien,
    }

    return await invoiceService.create(newInvoice);
  }
  const editFacility = async (data) => {
    console.log("san: " + data.tinhTrang)
    const editFac = await facilityService.update(data._id, data);
    console.log(editFac)
    // return editFac;
  }
  const editService = async (data) => {
    const find = await serviceService.get(data._id)
    const editFac = await serviceService.update(data._id, { tonKho: find.tonKho + data.soluong });
    console.log(editFac)
    // return editFac;
  }

  const editBooking = async (data) => {
    console.log('have datSan')
    console.log(data)
    const newEditBooking = await bookingService.update(data.datSan._id, data.datSan);
    return newEditBooking;
  }

  const deleteFacility = async (data) => {
    const deleteFac = await facilityService.delete(data._id);
    return deleteFac;
  }

  useEffect(() => {
    getFacility();
    getFacilityBooked();
  }, [fac]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(getFormattedTime());
  //     setCurrentDate(getFormattedDate());
  //   }, 1000); // 60000ms = 1 phút

  //   // Dọn dẹp bộ đếm thời gian khi component bị unmount
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <div className='facility'>
      <ToastContainer autoClose='2000' />
      <Header name="Sân thể thao" />
      <div className="flex justify-between items-center mb-3">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {user.user.chuc_vu == 'admin' &&
          <div className='bg-blue-200 border border-blue-700 p-2 text-blue-700 rounded-sm hover:bg-blue-300 cursor-pointer' onClick={e => setModalTime(true)}>Thời gian hoạt động</div>
        }
        {/* <button className="bg-green-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-green-700 w-10 h-10 m-auto rounded-xl"
                onClick={e => handleFacility()}
        >
          +
        </button> */}
      </div>
      <div className='flex pb-2'>
        <div className='flex items-center border border-gray-400 rounded-lg overflow-hidden'>
          <input name='' className='flex-1 p-1 pl-8' type="date" value={currentDate} readOnly />
          {/* <input type="time" className='flex-1 p-1 pl-2' value={currentTime} readOnly /> */}
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
          ((currentPage - 1) * 10 <= index && index < currentPage * 10) &&
          <div
            key={facility._id}
            className={`${facility.tinhTrang == "Trống"
              ? 'bg-white' : facility.tinhTrang == "Đã đặt"
                ? 'bg-blue-400' : facility.tinhTrang == "Đang sử dụng" ? 'bg-green-400' : 'bg-yellow-400'} 
              shadow-lg shadow-slate-500 rounded-lg overflow-hidden transition-all cursor-pointer hover:-translate-y-1`}
            onClick={e => handleFacility(facility)}
          >
            <div className={`px-1 text-sm flex justify-between `}>
              <p>{facility.ma_San}</p>
              {facility.tinhTrang == 'Bảo trì' ? <p> Bảo trì</p> : ''}
              {facility.datSan ? <p>{facility.datSan.khachHang.ho_KH + ' ' + facility.datSan.khachHang.ten_KH}</p> : ''}
            </div>
            <div className='relative facility-item-name pl-1 min-h-20 sm:min-h-24 md:h-36 justify-center items-center bg-no-repeat bg-center flex text-lg font-extrabold'>
              <img src={`http://localhost:3000/uploads/${backgroundSan(facility.loai_San.ten_loai)}`} className='absolute w-1/2 z-[0] opacity-80' alt="" />
              <p className='text-3xl z-[1] xl:text-4xl italic'>{facility.tinhTrang}</p>
            </div>
            <div className='z-10 text-sm sm:text-base px-1 sm:flex justify-between'>
              {facility.datSan ? facility.datSan.thoiGianBatDau + '-' + facility.datSan.thoiGianKetThuc : facility.ten_San}
              <p>{facility.datSan ? formatNumber(facility.datSan.thanhTien) : formatNumber(facility.bangGiaMoiGio) + "/h"}</p>
            </div>
          </div>
        ) : 'Chưa có dữ liệu'}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {/* from nhập dữ liệu */}
      {edit ? <FormFacility toggle={setEdit} handleData={handleFacility} data={fac} /> : ''}
      {modalTime ? <ChangeTime toggle={setModalTime} /> : ''}
    </div>
  )
}

export default Facility