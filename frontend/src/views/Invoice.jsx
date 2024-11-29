import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InvoiceService from '../services/invoice.service';
import Pagination from '../components/Pagination';
import FormInvoice from '../components/FormInvoice';
import SportTypeService from '../services/sportType.service';

import { ExportReactCSV } from '../components/ExportReactCSV';

const Invoice = () => {
  const [list, setList] = useState([]);
  const [listCSV, setListCSV] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [merge, setMerge] = useState(false)
  const [listMerge, setListMerge] = useState([])
  const [isChecked, setIsChecked] = useState({});
  const [filterValue, setFilterValue] = useState(null);
  const [listSportType, setListSportType] = useState([]);


  const user = useSelector((state) => state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoiceService = new InvoiceService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch);


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
      const { trangThai, thoiGianBatDau, thoiGianKetThuc, thoiGianCheckIn, thoiGianCheckOut, thanhTien, ghiChu, ngayDat } = item.datSan;
      // const newCSV = {
      //   _id: item._id, 
      //   ho_NV: ho_NV, 
      //   ten_NV: ten_NV, 
      //   email_NV: email_NV, 
      //   sdt_NV: sdt_NV, 
      //   ho_KH: ho_KH, 
      //   ten_KH: ten_KH, 
      //   email_KH: email_KH, 
      //   sdt_KH: sdt_KH, 
      //   loai_San: loai_San, 
      //   thoiGianCheckIn: thoiGianCheckIn, 
      //   thoiGianCheckOut: thoiGianCheckOut, 
      //   tinhTrang: tinhTrang, 
      //   khuVuc: khuVuc, 
      //   bangGiaMoiGio: bangGiaMoiGio, 
      //   hinhAnh_San: hinhAnh_San, 
      //   ngayTao_San: ngayTao_San, 
      //   ngayCapNhat_San: ngayCapNhat_San, 
      //   trangThai: trangThai, 
      //   thoiGianBatDau: thoiGianBatDau, 
      //   thoiGianKetThuc: thoiGianKetThuc, 
      //   thanhTien: thanhTien, 
      //   ghiChu: ghiChu, 
      //   ngayDat: ngayDat, 
      //   ngayTao_HD: item.ngayTao_H, 
      //   phuongThucThanhToan: item.phuongThucThanhToan, 
      //   tongTien: item.tongTien };
      // setListCSV([...listCSV, newCSV]);
      return [ho_NV, ten_NV, email_NV, sdt_NV, ho_KH, ten_KH, email_KH, sdt_KH, loai_San, thoiGianCheckIn, thoiGianCheckOut, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, item.ngayTao_HD, item.phuongThucThanhToan, item.tongTien, item._id].join(" ").toLowerCase();
    });
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
    if (checked) {
      // const isMatch = listMerge.some(item =>
      //   item.khachHang.sdt_KH === data.khachHang.sdt_KH &&
      //   item.datSan.ngayDat === data.datSan.ngayDat ||
      //   item.datSan.ngayTao === data.datSan.ngayTao
      //   // item.datSan.thoiGianBatDau === data.datSan.thoiGianBatDau &&
      //   // item.datSan.thoiGianKetThuc === data.datSan.thoiGianKetThuc
      // );
      // if (listMerge.length === 0) {
      setListMerge([...listMerge, data]);
      setIsChecked(prevState => ({ ...prevState, [data._id]: true }));
      // } 
      // else {
      //   // console.log(isMatch)
      //   console.log("Lỗi: Không thêm được.");
      //   setIsChecked(prevState => ({ ...prevState, [data._id]: false }));
      // }
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
    setList(data.reverse());
    const st = await sportTypeService.getAll();
    setListSportType(st);


    data.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      const { ho_NV, ten_NV, email_NV, sdt_NV } = item.nhanVien;
      const { ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, ngayTao_San, ngayCapNhat_San, ma_San } = item.datSan.san;
      const { trangThai, thoiGianBatDau, thoiGianKetThuc, thoiGianCheckIn, thoiGianCheckOut, thanhTien, ghiChu, ngayDat } = item.datSan;

      const newCSV = {
        _id: item._id,
        'Họ nhân viên': ho_NV, 'Tên nhân viên': ten_NV, 'Email nhân viên': email_NV, 'Số điện thoại nhân viên': sdt_NV,
        'Họ khách hàng': ho_KH, 'Tên khách hàng': ten_KH, 'Email khách hàng': email_KH, 'Số điện thoại khách hàng': sdt_KH,
        'Tên sân': ten_San, 'Mã sân': ma_San, 'Loại sân': loai_San, 'Khu vực': khuVuc, 'Giá mỗi giờ': bangGiaMoiGio,
        'Trạng thái thanh toán': trangThai, 'Thời gian bắt đầu': thoiGianBatDau, 'Thời gian kết thúc': thoiGianKetThuc,
        'Thời gian nhận sân': thoiGianCheckIn, 'Thời gian trả sân': thoiGianCheckOut, 'Ngày đặt': ngayDat, 'Thành tiền': thanhTien, 'Ghi chú': ghiChu,
        'Ngày tạo hóa đơn': item.ngayTao_HD,
        'Phương thức thanh toán': item.phuongThucThanhToan,
        'Tổng tiền': item.tongTien
      };

      setListCSV(prevListCSV => [...prevListCSV, newCSV]); // Sử dụng callback để đảm bảo đúng trạng thái của listCSV
    });
  }

  const handleFilter = async () => {
    console.log(filterValue);
    const filter = await invoiceService.filter(filterValue);
    setList(filter)
    setCurrentPage(1);
    setListCSV([]);
    filter.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      const { ho_NV, ten_NV, email_NV, sdt_NV } = item.nhanVien;
      const { ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, ngayTao_San, ngayCapNhat_San, ma_San } = item.datSan.san;
      const { trangThai, thoiGianBatDau, thoiGianKetThuc, thoiGianCheckIn, thoiGianCheckOut, thanhTien, ghiChu, ngayDat } = item.datSan;

      const newCSV = {
        _id: item._id,
        'Họ nhân viên': ho_NV, 'Tên nhân viên': ten_NV, 'Email nhân viên': email_NV, 'Số điện thoại nhân viên': sdt_NV,
        'Họ khách hàng': ho_KH, 'Tên khách hàng': ten_KH, 'Email khách hàng': email_KH, 'Số điện thoại khách hàng': sdt_KH,
        'Tên sân': ten_San, 'Mã sân': ma_San, 'Loại sân': loai_San.ten_loai, 'Khu vực': khuVuc, 'Giá mỗi giờ': bangGiaMoiGio,
        'Trạng thái thanh toán': trangThai, 'Thời gian bắt đầu': thoiGianBatDau, 'Thời gian kết thúc': thoiGianKetThuc,
        'Thời gian nhận sân': thoiGianCheckIn, 'Thời gian trả sân': thoiGianCheckOut, 'Ngày đặt': ngayDat, 'Thành tiền': thanhTien, 'Ghi chú': ghiChu,
        'Ngày tạo hóa đơn': item.ngayTao_HD,
        'Phương thức thanh toán': item.phuongThucThanhToan,
        'Tổng tiền': item.tongTien
      };

      setListCSV(prevListCSV => [...prevListCSV, newCSV]); // Sử dụng callback để đảm bảo đúng trạng thái của listCSV
    });
  }
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getInvoice();
  }, []);
  return (
    <div>
      <Header name="Hóa đơn" />
      <div className="flex justify-between mb-3">
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

        <button className="bg-blue-500 ml-3 p-2 text-white cursor-pointer hover:bg-blue-700 m-auto rounded-lg"
          onClick={mergeInvoice}
        >
          Gộp hóa đơn
        </button>
      </div>
      {filter ?
        <div className='bg-white shadow-gray-400 shadow-md rounded-md p-2 mb-4 h-fit flex top-full right-0 justify-between'>
          <div className='flex-1 grid grid-cols-2 md:grid-cols-[auto_auto_1fr]'>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="" onChange={e => setFilterValue({ ...filterValue, loaiSan: e.target.value })}>
              <option value="">Loại sân</option>
              {listSportType?.map((item) =>
                <option key={item._id} value={item.ten_loai}>{item.ten_loai}</option>
              )}
            </select>
            <select className='p-1 rounded-md bg-green-100 m-1' name="" id="" onChange={e => setFilterValue({ ...filterValue, phuongThucThanhToan: e.target.value })}>
              <option value="">Phương thức</option>
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
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

      {/* Bảng dữ liệu */}
      <div className="bg-white overflow-hidden text-[10px] sm:text-sm md:text-base rounded-lg shadow-sm border-2 border-gray-400">
        {/* Header bảngg */}
        <div className="flex justify-between p-4 px-6 pb-2 text-white bg-blue-500 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>

          <div className="w-1/6 font-semibold flex justify-center">
            NHÂN VIÊN
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            PHƯƠNG THỨC
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỔNG TIỀN
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>

        {/* List dữ liệu */}
        {list.length > 0 ? filterFacility()?.map((item, index) =>
          ((currentPage - 1) * 6 <= index && index < currentPage * 6) ?
            <div key={index} className={`flex p-4 px-6 pb-2 justify-between items-center min-h-14 max-h-16 py-2 border-b border-gray-300 text-center ${index % 2 != 0 && 'bg-blue-100'}`}>
              <div className="w-1/12">{index + 1}</div>
              <div className="w-1/6">{item.khachHang?.ho_KH + ' '} {item.khachHang?.ten_KH}</div>

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
                {formatNumber(item.tongTien + (item.phuThu || 0) - (item.giamGia || 0))}
              </div>
              <div className="w-1/6">
                {!merge ?
                  <i className="ri-eye-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(item)}></i>

                  : <input
                    type="checkbox"
                    className='w-4 h-4'
                    onChange={e => handleMerge(item, e.target.checked)}
                    checked={!!isChecked[item._id]}
                  />
                }
              </div>




            </div>
            : '') : <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div>
        }
        <div className='p-2 flex justify-between'>
          <ExportReactCSV csvData={listCSV} fileName={'HoaDon'} />
          {merge ? <button className='float-end border text-blue-600 rounded-md border-blue-500 p-1 m-1 hover:bg-blue-500 hover:text-white' onClick={e => { if (listMerge.length > 0) setEdit(!edit) }}>Xuất hóa đơn</button> : ''}
        </div>
      </div>

      {/* Phân trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />



      {edit ? <FormInvoice toggle={setEdit} data={fac} listData={listMerge} /> : ''}

    </div>
  )
}

export default Invoice