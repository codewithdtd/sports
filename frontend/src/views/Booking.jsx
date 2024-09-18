import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FromBooking from '../components/FromBooking';
import bookingService from '../services/booking.service';
import facilityService from '../services/facility.service';
import Pagination from '../components/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Booking = () => {
  // const dispatch = useDispatch();
  const user = useSelector((state)=> state.user.login.user)

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
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
    if(data.phuongThuc == 'edit') {
      console.log('edit')
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeNow = `${hours}:${minutes}`
      if(data.trangThai === 'Nhận sân') {
        data.san.tinhTrang = "Đang sử dụng"
        data.thoiGianCheckIn = timeNow;
        await editFacility(data.san)
      }
      if(await editBooking(data)) {
        console.log('Đã cập nhật');
      }
    }
    if(data.phuongThuc == 'create') {
      console.log('create')
      console.log(data)
      if(await createBooking(data))
        console.log('Đã thêm mới');
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
      return [ ho_KH, ten_KH, email_KH, sdt_KH, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao ].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if(search == '') 
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

  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getBooking = async () => {
    const data = await bookingService.getAll();
    setList(data);
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
  }, [list]);
  return (
    <div className='facility'>
      <Header name="Quản lý Đặt sân" />
      <div className="flex justify-between mb-5">
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
          <div className='bg-white shadow-black shadow-sm rounded-md p-2 h-fit flex flex-col top-full right-0 absolute justify-around'>
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
        <button className="bg-green-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-green-700 w-10 h-10 m-auto rounded-xl"
                onClick={e => handleData()}
        >
          +
        </button>
      </div>
      {/* Lọc dữ liệu */}
      

      <div className="bg-white text-[10px] sm:text-sm md:text-base p-4 rounded-lg shadow-sm border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỔNG TIỀN
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-3/12 font-semibold flex justify-center">
            CHI TIẾT
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY ĐẶT
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TRẠNG THÁI
            <div className="">
              <i className={''}></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>


        {/* Nội dung bảng */}
        {list.length > 0 ? filterFacility().map((facility, index) => 
        ((currentPage-1)*6 <= index && index < currentPage*6) ?
       
          <div key={facility._id} className="flex justify-between py-2 max-h-[70px] border-b border-gray-300 text-center items-center"> 
            <div className="w-1/12">{ index+1 }</div>
            <div className="w-1/6">
              {facility.khachHang.ho_KH + " " + facility.khachHang.ten_KH}
            </div>
            <div className="w-1/6">
              { formatNumber(parseInt(facility.thanhTien))}
              <p>{ facility.trangThaiThanhToan }</p>
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
            <div className="w-1/6">{ facility.ngayTao }</div>
            <div className="w-1/6">
              <p className={`m-auto p-1 ${facility.trangThai == 'Hoàn thành' ? 'text-white rounded-lg bg-green-500 w-full lg:w-3/4 shadow-md shadow-slate-500' : facility.trangThai == 'Đã hủy' ? 'text-white rounded-lg bg-red-500 w-full lg:w-3/4 shadow-md shadow-slate-500' : facility.trangThai == 'Đã duyệt' ? 'text-white rounded-lg bg-blue-500 w-full md:w-3/4 shadow-md shadow-slate-500' : 'text-white rounded-lg bg-gray-400 w-full md:w-3/4 shadow-md shadow-slate-500'}`}>{facility.trangThai}</p>
            </div>
            <div className="w-1/6 text-xl">
              <i className="ri-edit-box-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(facility)}></i>
              <i className="ri-delete-bin-2-line w-[40px] h-[40px] bg-red-600 text-white p-2 rounded-md" onClick={e => deleteBooking(facility)} ></i>
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
        {/* from nhập dữ liệu */}
      {edit ? <FromBooking bookingList={list} toggle={setEdit} handleData={handleData} data={fac} /> : '' }
    </div>
  )
}

export default Booking