import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoice.service';
import Pagination from '../components/Pagination';
import FormInvoice from '../components/FormInvoice';

const Invoice = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [merge, setMerge] = useState(false)
  const [listMerge, setListMerge] = useState([])
  const [isChecked, setIsChecked] = useState({});

  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();


  const [fac, setFac] = useState({});
  // Định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return list.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      const { ho_NV, ten_NV, email_NV, sdt_NV } = item.nhanVien;
      const { loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item.datSan.san;
      const { trangThai, thoiGianBatDau, thoiGianKetThuc,thoiGianCheckIn, thoiGianCheckOut, thanhTien, ghiChu, ngayDat } = item.datSan;
      return [ ho_NV, ten_NV, email_NV, sdt_NV, ho_KH, ten_KH, email_KH, sdt_KH, loai_San, thoiGianCheckIn, thoiGianCheckOut, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, item.ngayTao_H, item.phuongThucThanhToan, item.tongTien ].join(" ").toLowerCase();
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

  const totalPages = Math.ceil(filterFacility().length / 7);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleData = async (data = {}) => {
    setFac(data);
    setEdit(!edit);  
  };

  const mergeInvoice = () => {
    setMerge(!merge)
    setListMerge([])
    setIsChecked({})
  }
  const handleMerge = (data, checked) => {
    if(checked) {
      const isMatch = listMerge.some(item => 
        item.khachHang.sdt_KH === data.khachHang.sdt_KH &&
        item.datSan.ngayDat === data.datSan.ngayDat &&
        item.datSan.thoiGianBatDau === data.datSan.thoiGianBatDau &&
        item.datSan.thoiGianKetThuc === data.datSan.thoiGianKetThuc
      );
      if (listMerge.length === 0 || isMatch) {
        setListMerge([...listMerge, data]); 
        setIsChecked(prevState => ({ ...prevState, [data._id]: true }));
      } else {
        console.log(isMatch)
        console.log("Lỗi: Không thêm được.");
        setIsChecked(prevState => ({ ...prevState, [data._id]: false }));
      }
    }
    else {
      setListMerge(listMerge.filter(item => item._id != data._id))
      setIsChecked(prevState => ({ ...prevState, [data._id]: false }));
    }
    console.log(listMerge)
  }
  // Lấy dữ liệu từ server
  const getInvoice = async () => {
    const data = await invoiceService.getAll();
    setList(data);
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getInvoice();
  }, [list]);
  return (
    <div>
      <Header name="Quản lý hóa đơn" />
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
        <button className="bg-green-500 ml-3 p-2 text-white cursor-pointer hover:bg-green-700 m-auto rounded-lg"
              onClick={mergeInvoice}  
        >
          Gộp hóa đơn
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] sm:text-sm md:text-base p-4 rounded-lg shadow-sm border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>
          
          <div className="w-1/6 font-semibold flex justify-center">
            NHÂN VIÊN
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            PHƯƠNG THỨC
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỔNG TIỀN
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>

        {/* List dữ liệu */}
        {list.length > 0 ? filterFacility()?.map((item, index) =>
        ((currentPage-1)*7 <= index && index < currentPage*7) ?
        <div key={index} className="flex justify-between items-center min-h-14 max-h-16 py-2 border-b border-gray-300 text-center">
          <div className="w-1/12">{index+1}</div>
          <div className="w-1/6">{item.khachHang?.ho_KH +' '} {item.khachHang?.ten_KH}</div>
          
          <div className="w-1/6 flex justify-center">
            {item.nhanVien?.ho_NV} {item.nhanVien?.ten_NV}
          </div>
          <div className="w-1/6 flex justify-center">
            {item.phuongThucThanhToan}
          </div>
          <div className="w-1/6 flex justify-center">
            {item.ngayTao_HD}
          </div>
          <div className="w-1/6 flex justify-center">
            {formatNumber(item.tongTien)}
          </div>
          <div className="w-1/6">
            <i className="ri-eye-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(item)}></i>
            {/* <i className="ri-delete-bin-2-line w-[40px] h-[40px] bg-red-600 text-white p-2 rounded-md" onClick={e => deleteBooking(facility)} ></i> */}
          </div>
          
          {merge ? 
          <input 
              type="checkbox" 
              className='w-4 h-4' 
              onChange={e => handleMerge(item, e.target.checked)} 
              checked={!!isChecked[item._id]}
          /> : '' }
          
        </div>
        : '') : <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div>
        }
      </div>
      {merge ? <button className='float-end border text-green-600 rounded-md border-green-500 p-1 m-1' onClick={e => {if(listMerge.length > 0) setEdit(!edit)}}>Xuất hóa đơn</button> : ''}

      {/* Phân trang */}
      <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

    
      {edit ? <FormInvoice toggle={setEdit} data={fac} listData={listMerge} /> : '' }
      
    </div>
  )
}

export default Invoice