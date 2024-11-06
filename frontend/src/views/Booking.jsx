import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FormBooking from '../components/FormBooking';
import BookingService from '../services/booking.service';
import SportTypeService from '../services/sportType.service';
import FacilityService from '../services/facility.service';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ServiceService from '../services/service.service';
import ViewBookingTime from '../components/ViewBookingTime';
const Booking = () => {
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.user.login.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingService = new BookingService(user, dispatch);
  const facilityService = new FacilityService(user, dispatch);
  const serviceService = new ServiceService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  const [filter, setFilter] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [sort, setSort] = useState({ thanhTien: false, ngayDat: false, ngayTao: false });
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
  const [viewListTime, setViewListTime] = useState(false);
  const [listSportType, setListSportType] = useState([]);
  const [fac, setFac] = useState({
    khachHang: {
      ho_KH: "",
      ten_KH: "",
      email_KH: "",
      sdt_KH: "",
      hinhAnh_KH: "",
    },
    trangThai: "",
    san: {
      _id: "",
      ten_San: "",
      loai_San: "",
      tinhTrang: "",
      khuVuc: "",
      hinhAnh_San: "",
      ngayTao_San: "",
      ngayCapNhat_San: "",
      bangGiaMoiGio: 0,
      ma_San: ""
    },
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
    thoiGianCheckIn: "",
    thoiGianCheckOut: "",
    hoiVien: "",
    thanhTien: 0,
    ghiChu: "",
    ngayDat: "",
    ngayTao: "",

  });
  const [search, setSearch] = useState('');
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);


  const handleData = async (data = {}) => {
    (data.khachHang)
      ? setFac(data)
      : setFac({
        khachHang: {
          ho_KH: "",
          ten_KH: "",
          email_KH: "",
          sdt_KH: "",
          hinhAnh_KH: "",
        },
        trangThai: "",
        san: {
          _id: "",
          ten_San: "",
          loai_San: "",
          tinhTrang: "",
          khuVuc: "",
          hinhAnh_San: "",
          ngayTao_San: "",
          ngayCapNhat_San: "",
          bangGiaMoiGio: 0,
          ma_San: ""
        },
        thoiGianBatDau: "",
        thoiGianKetThuc: "",
        thoiGianCheckIn: "",
        thoiGianCheckOut: "",
        hoiVien: "",
        thanhTien: 0,
        ghiChu: "",
        ngayDat: "",
        ngayTao: "",

      });
    console.log(data)
    if (data.phuongThuc == 'edit') {
      console.log('edit')
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeNow = `${hours}:${minutes}`
      if (data.trangThai === 'Nhận sân') {
        data.san.tinhTrang = "Đang sử dụng"
        data.thoiGianCheckIn = timeNow;
        await editFacility(data.san)
      }
      if (await editBooking(data)) {
        console.log('Đã cập nhật');
        setFac(fac);
      }
    }
    if (data.phuongThuc == 'create') {
      console.log('create')
      console.log(data)
      let updatedServices = null;
      // if(data.dichVu?.length > 0) {
      //   updatedServices = await Promise.all(
      //     data.dichVu?.map(async (service) => {
      //       service.tonKho -= service.soluong;
      //       // service.choMuon += service.soluong;
      //       return await serviceService.update(service._id, service);
      //     })
      //   );
      // }  
      // if(await createBooking(data) && updatedServices)
      if (await createBooking(data)) {
        console.log('Đã thêm mới');
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
    return list.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      const { loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item.san;
      const { trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao } = item;
      return [ho_KH, ten_KH, email_KH, sdt_KH, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao].join(" ").toLowerCase();
    });
  }
  const handleFilter = async () => {
    console.log(filterValue);
    const filter = await bookingService.filter(filterValue);
    setList(filter)
    setCurrentPage(1)
  }
  const handleSort = (key, type) => {
    if (key == 'thanhTien') {
      const sortedList = [...filterFacility()].sort((a, b) =>
        type ? a.thanhTien - b.thanhTien : b.thanhTien - a.thanhTien
      );
      setList(sortedList);
    }
    if (key == 'ngayDat') {
      const sortedList = [...filterFacility()].sort((a, b) => {
        const dateA = parseDate(a.ngayDat);
        const dateB = parseDate(b.ngayDat);
        const timeA = new Date(`1970-01-01T${a.thoiGianBatDau}:00`); // Tạo đối tượng Date cho thời gian
        const timeB = new Date(`1970-01-01T${b.thoiGianBatDau}:00`);

        // So sánh ngày trước
        if (dateA.getTime() !== dateB.getTime()) {
          return !type ? dateA - dateB : dateB - dateA; // Sắp xếp theo ngày
        } else {
          return !type ? timeA - timeB : timeB - timeA; // Nếu ngày bằng nhau, sắp xếp theo thời gian
        }
      });
      setList(sortedList);
    }
    if (key == 'ngayTao') {
      const parseDateTime = (dateTimeString) => {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second); // month - 1 vì tháng bắt đầu từ 0
      };

      // Sắp xếp mảng theo ngày tạo
      const sortedList = [...filterFacility()].sort((a, b) => {
        const dateTimeA = parseDateTime(a.ngayTao);
        const dateTimeB = parseDateTime(b.ngayTao);

        return type ? dateTimeA - dateTimeB : dateTimeB - dateTimeA; // Sắp xếp theo ngày giờ
      });
      setList(sortedList);
    }
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if (search == '')
      return list;
    const searchTerms = search.toLowerCase().split(' ');
    const convertedStrings = convertString();
    const filteredlist = list.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      )
    );

    return filteredlist;
  }

  const totalPages = Math.ceil(filterFacility().length / 6);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month - 1 vì tháng bắt đầu từ 0
  };

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

  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getBooking = async () => {
    const data = await bookingService.getAll();
    const st = await sportTypeService.getAll();
    setList(data.reverse());
    setListSportType(st);
  }
  const createBooking = async (data) => {
    const newFac = await bookingService.create(data);
    return newFac;
  }
  const editBooking = async (data) => {
    const editFac = await bookingService.update(data._id, data);
    return editFac;
  }
  const editFacility = async (data) => {
    const editFac = await facilityService.update(data._id, data);
    return editFac;
  }
  const deleteBooking = async (data) => {
    const deleteFac = await bookingService.delete(data._id);
    return deleteFac;
  }

  useEffect(() => {
    getBooking();
  }, [fac]);
  return (
    <div className='facility'>
      <Header name="Đặt sân" />
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => (setSearch(e.target.value), setCurrentPage(1))} />
          </div>
          <div className="bg-blue-500 cursor-pointer hover:bg-blue-700 ml-2 max-w-50% shadow-gray-700 shadow-sm text-white overflow-hidden rounded-lg p-2" onClick={e => setFilter(!filter)}>
            <i className="ri-arrow-down-double-line"></i>
            Lọc
          </div>
        </div>
        <div className="bg-blue-500 cursor-pointer hover:bg-blue-700 ml-2 max-w-50% shadow-gray-700 shadow-sm text-white overflow-hidden rounded-lg p-2" onClick={e => setViewListTime(!viewListTime)}>
          Xem sân trống
        </div>
        <button className="bg-blue-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-blue-700 w-10 h-10 m-auto rounded-xl"
          onClick={e => handleData()}
        >
          +
        </button>
      </div>
      {/* Lọc dữ liệu */}
      {filter ?
        <div className='bg-white shadow-gray-400 shadow-md rounded-md p-2 mb-4 h-fit flex top-full right-0 justify-between'>
          <div className='flex-1 grid grid-cols-3 md:grid-cols-[auto_auto_auto_1fr]'>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="" onChange={e => setFilterValue({ ...filterValue, loaiSan: e.target.value })}>
              <option value="">Loại sân</option>
              {listSportType?.map((item) =>
                <option key={item._id} value={item.ten_loai}>{item.ten_loai}</option>
              )}
            </select>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="" onChange={e => setFilterValue({ ...filterValue, tinhTrang: e.target.value })}>
              <option value="">Tình trạng</option>
              <option value="Chưa duyệt">Chưa duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Đã đặt">Đã đặt</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="" onChange={e => setFilterValue({ ...filterValue, trangThaiThanhToan: e.target.value })}>
              <option value="">Thanh toán</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
            </select>

            <div className='flex'>
              {/* Ô chọn ngày từ ngày X */}
              <div className="m-1 flex items-center">
                <label className='mr-2'>Từ:</label>
                <input type="date" className="p-1 rounded-md bg-green-100" max={filterValue?.ngayKetThuc} onChange={e => setFilterValue({ ...filterValue, ngayBatDau: e.target.value })} />
              </div>

              {/* Ô chọn ngày đến ngày Y */}
              <div className="m-1 flex items-center">
                <label className='mr-2'>Đến:</label>
                <input type="date" className="p-1 rounded-md bg-green-100" min={filterValue?.ngayBatDau} onChange={e => setFilterValue({ ...filterValue, ngayKetThuc: e.target.value })} />
              </div>
            </div>
          </div>
          <button className='bg-blue-500 text-white px-2 py-1 text-sm cursor-pointer hover:bg-blue-700 m-auto rounded-md' onClick={handleFilter}>Xác nhận</button>
        </div>
        : ''}


      <div className="bg-white text-[10px] overflow-hidden sm:text-sm md:text-base rounded-lg shadow-md shadow-gray-400 border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between p-4 pb-2 border-b bg-blue-500 border-gray-300 text-white text-center ">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỔNG TIỀN
            <div className="flex flex-col justify-center" >
              <i className="ri-arrow-drop-up-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('thanhTien', 0)}></i>
              <i className="ri-arrow-drop-down-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('thanhTien', 1)}></i>
            </div>
          </div>
          <div className="w-3/12 font-semibold flex justify-center">
            NGÀY ĐẶT
            <div className="flex flex-col justify-center" >
              <i className="ri-arrow-drop-up-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('ngayDat', 0)}></i>
              <i className="ri-arrow-drop-down-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('ngayDat', 1)}></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY TẠO
            <div className="flex flex-col justify-center" >
              <i className="ri-arrow-drop-up-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('ngayTao', 0)}></i>
              <i className="ri-arrow-drop-down-fill text-2xl px-1 leading-[10px] hover:text-gray-600" onClick={e => handleSort('ngayTao', 1)}></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TRẠNG THÁI
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>


        {/* Nội dung bảng */}
        {list.length > 0 ? filterFacility().map((facility, index) =>
          ((currentPage - 1) * 6 <= index && index < currentPage * 6) ?

            <div key={facility._id} className={`flex justify-between p-4 py-2 max-h-[70px] border-b border-gray-300 text-center items-center ${index % 2 != 0 && 'bg-blue-100'}`}>
              <div className="w-1/12">{index + 1}</div>
              <div className="w-1/6">
                {facility.khachHang.ho_KH + " " + facility.khachHang.ten_KH}
              </div>
              <div className="w-1/6">
                {formatNumber(parseInt(facility.thanhTien))}
                <p className={`${facility.trangThaiThanhToan == 'Đã thanh toán' ? 'text-blue-800 font-bold' : ''}`}>{facility.trangThaiThanhToan}</p>
              </div>
              <div className="w-3/12">

                <div className='md:flex border-gray-500 items-center'>
                  <p className='md:w-1/2'>{facility.san.ma_San}</p>

                  <div className='md:w-1/2'>
                    <p>{facility.thoiGianBatDau} - {facility.thoiGianKetThuc}</p>
                    <p>{facility.ngayDat}</p>
                  </div>
                </div>


              </div>
              <div className="w-1/6">{facility.ngayTao}</div>
              <div className="w-1/6">
                <p className={`m-auto p-1 
                  ${facility.trangThai == 'Hoàn thành' ? 'text-white rounded-lg bg-green-500 w-full lg:w-3/4 shadow-md '
                    : facility.trangThai == 'Đã hủy' ? 'text-white rounded-lg bg-red-500 w-full lg:w-3/4 shadow-md '
                      : facility.trangThai == 'Đã duyệt' ? 'text-white rounded-lg bg-blue-500 w-full md:w-3/4 shadow-md '
                        : facility.trangThai == 'Nhận sân' ? 'text-white rounded-lg bg-yellow-500 w-full md:w-3/4 shadow-md ' : 'text-white rounded-lg bg-gray-400 w-full md:w-3/4 shadow-md '}`}>{facility.trangThai}</p>
              </div>
              <div className="w-1/6 text-xl">
                <i className="ri-edit-box-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(facility)}></i>
                {/* <i className="ri-delete-bin-2-line w-[40px] h-[40px] bg-red-600 text-white p-2 rounded-md" onClick={e => deleteBooking(facility)} ></i> */}
              </div>
            </div>
            : '') : <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div>
        }
      </div>


      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {viewListTime ? <ViewBookingTime toggle={setViewListTime}></ViewBookingTime> : ''}
      {/* from nhập dữ liệu */}
      {edit ? <FormBooking bookingList={list} toggle={setEdit} handleData={handleData} data={fac} /> : ''}
    </div>
  )
}

export default Booking