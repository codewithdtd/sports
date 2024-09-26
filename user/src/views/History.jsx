import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/booking.service';
import invoiceService from '../services/invoice.service';
import Pagination from '../components/Pagination';
import Invoice from '../components/Invoice';

const History = () => {
  const user = useSelector((state)=> state.user.login.user)
  const accessToken = user?.accessToken; 
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
  const [listInvoice, setListInvoice] = useState([]);
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
      : '';
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
      const updatedServices = await Promise.all(
        data.dichVu?.map(async (service) => {
          service.tonKho -= service.soluong;
          // service.choMuon += service.soluong;
          return await serviceService.update(service._id, service);
        })
      );
      if(await createBooking(data) && updatedServices)
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
      const { loai_San, tinhTrang, khuVuc, bangGiaMoiGio, ngayTao_San, ngayCapNhat_San, ten_San, ma_San } = item.san;
      const { trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao } = item;
      return [ ho_KH, ten_KH, email_KH, sdt_KH, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, ten_San, ma_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao ].join(" ").toLowerCase();
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
    const id = { id: user.user._id }
    const data = await bookingService.getAll(id, accessToken);
    const invoice = await invoiceService.getAll(user.user._id)
    setList(data);
    setListInvoice(invoice)
  }
  const createBooking = async (data) => {
    const newFac = await bookingService.create(data);
    return newFac;  
  }
  const editBooking = async (data) => {
    data.trangThai = 'Đã hủy';
    const editFac = await bookingService.update(data._id, data);
    setFac(edit)
    return editFac;
  }

  useEffect(() => {
    getBooking();
  }, [fac]);
  return (
    <div className='pt-4'>
      <h1 className='text-2xl font-bold text-center'>LỊCH SỬ ĐẶT SÂN</h1>
      <div className='px-4'>
        <div className='flex-1 flex justify-between py-5'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div> 
        <div className="flex justify-between py-2 bg-gray-200 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">TÊN SÂN</div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỔNG TIỀN
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-3/12 font-semibold flex justify-center">
            CHI TIẾT
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY ĐẶT
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


        {filterFacility()?.map((item, index) => 
        ((currentPage-1)*6 <= index && index < currentPage*6) ?
        <div key={index} className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12">{index +1}</div>
          <div className="w-1/6 text-start">
            <p>{item.san.ten_San + ' - ' + item.san.ma_San}</p>
            <ul className='ml-4 list-disc'>
              {item.dichVu?.map((dichVu) =>
                <li key={dichVu._id}>{dichVu.ten_DV} x{dichVu.soluong}</li>
              )}
            </ul>
          </div>
          <div className="w-1/6 flex justify-center">
            {formatNumber(item.thanhTien)}
          </div>
          <div className="w-3/12 md:flex justify-around">
            <p>{item.thoiGianBatDau} - {item.thoiGianKetThuc}</p>
            <p>{item.ngayDat}</p>
          </div>
          <div className="w-1/6 flex justify-center">
            {item.ngayTao}
          </div>
          <div className="w-1/6 flex justify-center">
            {item.trangThai}
          </div>
          <div className="w-1/6">
           {listInvoice.find((invoice) => invoice.datSan._id == item._id) ? (
              <i
                className="ri-bill-line hover:bg-gray-400 cursor-pointer bg-gray-200 p-2 rounded-lg"
                onClick={(e) => handleData(listInvoice.find((invoice) => invoice.datSan._id == item._id))}
              ></i>
            )
            : ''}

            {item.trangThai === 'Chưa duyệt' ? 
            <button className='bg-red-500 hover:bg-red-700 p-1 rounded-md mx-2' onClick={e => editBooking(item)}>Hủy</button>
            : ''}
          </div>
        </div> : <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div>
        )}  
      </div>
       <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        {/* from nhập dữ liệu */}
      {edit ? <Invoice toggle={setEdit} data={fac} /> : '' }
    </div>
  )
}

export default History