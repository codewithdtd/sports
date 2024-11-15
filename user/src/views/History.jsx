import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Booking from '../services/booking.service';
import UserService from '../services/user.service';
import invoiceService from '../services/invoice.service';
import NotifyService from '../services/notify.service';
import reviewService from '../services/review.service';
import Pagination from '../components/Pagination';
import Invoice from '../components/Invoice';
import Feedback from '../components/Feedback';
import sportTypeService from '../services/sportType.service';

const History = () => {
  const user = useSelector((state) => state.user.login.user)
  const accessToken = user?.accessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingService = new Booking(user, dispatch);
  const userService = new UserService(user, dispatch);
  const notifyService = new NotifyService(user, dispatch);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  const [review, setReview] = useState(false);
  const [reviewed, setReviewed] = useState(null);
  const [reviews, setReviews] = useState({});
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
  const [listSportType, setListSportType] = useState([]);
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
      }
    }
    if (data.phuongThuc == 'create') {
      console.log('create')
      console.log(data)
      const updatedServices = await Promise.all(
        data.dichVu?.map(async (service) => {
          service.tonKho -= service.soluong;
          // service.choMuon += service.soluong;
          return await serviceService.update(service._id, service);
        })
      );
      if (await createBooking(data) && updatedServices)
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
      return [ho_KH, ten_KH, email_KH, sdt_KH, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, ten_San, ma_San, ngayTao_San, ngayCapNhat_San, trangThai, thoiGianBatDau, thoiGianKetThuc, thanhTien, ghiChu, ngayDat, ngayTao].join(" ").toLowerCase();
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

  const totalPages = Math.ceil(filterFacility()?.length / 6);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  function tinhChenhLechNgay(ngayNhap) {
    const [day, month, year] = ngayNhap.split('/').map(Number);
    const date1 = new Date(year, month - 1, day);  // Ngày bạn nhập (dd/mm/yyyy)
    const date2 = new Date();            // Ngày hiện tại

    // Tính số mili-giây giữa hai ngày
    const diffInMs = date2 - date1;

    // Chuyển mili-giây thành số ngày
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Làm tròn lên
    console.log(diffInDays < 0)
    return diffInDays;
  }
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }



  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getBooking = async () => {
    const id = { id: user.user._id }
    const data = await bookingService.getAll(id, accessToken, dispatch);
    const invoice = await invoiceService.getAll(user.user._id)
    const sportType = await sportTypeService.getAll();
    setList(data.reverse());
    setListInvoice(invoice);
    setListSportType(sportType);
  }
  const createBooking = async (data) => {
    const newFac = await bookingService.create(data);
    return newFac;
  }
  const editBooking = async (data) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy sân?");
    if (isConfirmed) {
      const newNotify = {
        tieuDe: 'Hủy đặt sân',
        noiDung: `Người dùng ${data?.khachHang.sdt_KH} hủy đặt sân ${data?._id} mã sân ${data?.san?.ma_San} vào ${data.thoiGianBatDau} - ${data.thoiGianKetThuc} ${data.ngayDat}`,
        nguoiDung: 'Nhân viên',
        daXem: false
      }
      await notifyService.create(newNotify);
      if (data.trangThaiThanhToan == 'Đã thanh toán') {
        const refund = await userService.refund(data, accessToken)
        if (refund) {
          data.trangThai = 'Đã hủy';
          data.trangThaiThanhToan = 'Đã hoàn tiền';
          const editFac = await bookingService.update(data._id, data);
          setFac(edit)
          return editFac;
        }
      }
      data.trangThai = 'Đã hủy';
      const editFac = await bookingService.update(data._id, data);
      setFac(edit)
      return editFac;
    }
  }
  const editRequestBooking = async (data) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy sân?");
    if (isConfirmed) {
      data.yeuCauHuy = true;
      const editFac = await bookingService.update(data._id, data);
      const newNotify = {
        tieuDe: 'Yêu cầu hủy đặt sân',
        noiDung: `Người dùng ${data?.khachHang?.sdt_KH} hủy đặt sân ${data._id} mã sân ${data?.san?.ma_San} vào ${data.thoiGianBatDau} - ${data.thoiGianKetThuc} ${data.ngayDat}`,
        nguoiDung: 'Nhân viên',
        daXem: false
      }
      await notifyService.create(newNotify);
      setFac(edit)
      return editFac;
    }
  }
  const getReview = async (id) => {
    try {
      const datSan = { 'datSan._id': id }
      const review = await reviewService.getOne(datSan)
      if (review) {
        return review;
      }
      else {
        return false;
      }
    } catch (error) {
      console.log(error)
      return false;
    }
  }
  const fetchAllReviews = async () => {
    const reviewResults = {};

    // Duyệt qua các item trong filterFacility để gọi getReview cho từng item
    const items = list;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const review = await getReview(item._id.toString()); // Gọi getReview
        reviewResults[item._id] = review; // Lưu kết quả vào object
      } catch (error) {
        console.error(`Error fetching review for item ${item._id}:`, error);
      }
    }

    setReviews(reviewResults); // Cập nhật state với tất cả kết quả review
  };

  useEffect(() => {
    getBooking();
  }, [fac]);
  useEffect(() => {
    fetchAllReviews();
  }, [list]);

  return (
    <div className='py-4'>
      <h1 className='text-3xl text-blue-600 font-bold text-center'>LỊCH SỬ ĐẶT SÂN</h1>
      <div className='px-4'>
        <div className='flex-1 flex justify-between py-5'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className='rounded-lg grid md:grid-cols-2 gap-4'>
          {/* <div className="flex justify-between py-2 bg-blue-500 border-b mb-3 border-gray-300 shadow-md shadow-gray-400 text-center rounded-lg">
            <div className="w-1/6 font-semibold">TÊN</div>
            <div className="w-1/6 font-semibold">TÊN SÂN</div>
            <div className="w-1/6 font-semibold flex justify-center">
              TỔNG TIỀN
            </div>
            <div className="w-3/12 font-semibold flex justify-center">
              CHI TIẾT
            </div>
            <div className="w-1/6 font-semibold flex justify-center">
              NGÀY ĐẶT
            </div>
            <div className="w-1/6 font-semibold flex justify-center">
              TRẠNG THÁI
            </div>
            <div className="w-1/6">
              
            </div>
          </div> */}


          {filterFacility()?.map((item, index) =>
            ((currentPage - 1) * 6 <= index && index < currentPage * 6) ?
              <div key={index} className='flex flex-col shadow-md  bg-gray-100 shadow-gray-400 rounded-lg border border-gray-400 mb-3 p-2 text-base'>
                <div className='flex'>
                  <div className='flex w-1/2 md:w-1/2 p-5'>
                    <img src={`http://localhost:3000/uploads/${listSportType.find(element => element._id === item.san.loai_San._id).hinhAnhDaiDien}`} className='m-auto object-contain bg-blue-200 rounded-xl' alt="" />
                  </div>
                  <div className={`flex flex-col items-start text-center min-h-32 p-5`}>
                    {/* <div className="w-1/12"></div> */}
                    <div className="my-auto">
                      Khách hàng: {item.khachHang.ho_KH + ' ' + item.khachHang.ten_KH}
                    </div>
                    <div className="my-auto text-start">
                      <p>Tên sân: {item.san.ten_San + ' - ' + item.san.ma_San}</p>
                      <ul className='list-disc'>
                        {item.dichVu?.map((dichVu) =>
                          <li key={dichVu._id} className='ml-20'>{dichVu.ten_DV} x{dichVu.soluong}</li>
                        )}
                      </ul>
                    </div>
                    <div className="my-auto text-start">
                      <p className='my-[4px]'>Tiền thanh toán: {formatNumber(item.thanhTien)}</p>
                      <p className='my-auto'>
                        Trạng thái thanh toán:
                        <span className={`${item.trangThaiThanhToan == 'Đã thanh toán' ? 'text-blue-700' : ''} my-auto ml-2 px-2 w-fit mx-auto shadow-gray-500 rounded-xl font-medium`}>{item.trangThaiThanhToan}</span>
                      </p>
                    </div>
                    <div className="my-auto">
                      <p className=''>Giờ đặt: {item.thoiGianBatDau} - {item.thoiGianKetThuc}</p>
                      <p className='my-[4px]'>Ngày đặt: {item.ngayDat}</p>
                    </div>
                    <div className="my-auto flex justify-center">
                      Ngày tạo: {item.ngayTao}
                    </div>
                    <div className="my-auto flex justify-center items-center h-fit">
                      Trạng thái:
                      <p className={`${item.trangThai == 'Hoàn thành' ? 'text-green-700 rounded-lg bg-green-200 border-green-500 border-2 shadow-md '
                        : item.trangThai == 'Đã hủy' ? 'text-red-700 rounded-lg bg-red-300 border-red-500 border-2 shadow-md '
                          : item.trangThai == 'Đã duyệt' ? 'text-blue-600 rounded-lg bg-blue-200 border-blue-500 border-2 shadow-md px-3'
                            : item.trangThai == 'Nhận sân' ? 'text-yellow-700 rounded-lg bg-yellow-300 border-yellow-600 border-2 shadow-md '
                              : 'rounded-md'} px-3 w-fit font-medium my-auto ml-3`}>
                        {item.trangThai}
                      </p>
                    </div>
                    <div className="text-start">
                      <p className='my-auto'>Tiền thanh toán: <b>{formatNumber(item.thanhTien)}</b></p>
                    </div>
                    <div className="flex pt-4 w-full justify-between">
                      {listInvoice.find((invoice) => invoice.datSan._id == item._id) ? (
                        <span className='hover:bg-gray-400 cursor-pointer bg-gray-200 p-2 rounded-lg' onClick={(e) => handleData(listInvoice.find((invoice) => invoice.datSan._id == item._id))}><i
                          className="ri-bill-line"
                        ></i> Hóa đơn
                        </span>
                      )
                        : ''}

                      {item.trangThai === 'Chưa duyệt' ?
                        <button className='bg-red-500 p-1 shadow-md shadow-gray-500 text-white px-2 hover:bg-red-700 my-auto rounded-md mx-2' onClick={e => editBooking(item)}>Hủy sân</button>
                        : ''}
                      {(item.trangThai === 'Đã duyệt' && !item.yeuCauHuy) ?
                        <button className='text-red-500 border-red-500 border hover:bg-red-200 my-auto rounded-md mx-2 p-1' onClick={e => editRequestBooking(item)}>Yêu cầu hủy</button>
                        : ''}
                      {(item.trangThai === 'Đã duyệt' && item.yeuCauHuy) ?
                        <button className='text-red-500 italic my-auto rounded-md mx-2 p-1'>Đã gửi yêu cầu hủy</button>
                        : ''}
                      {/* Hiển thị kết quả của getReview() */}
                      {reviews[item._id] ?
                        <button className='border-gray-500 text-gray-600 border hover:bg-gray-300 my-auto rounded-md mx-2 p-1' onClick={e => { setReview(true), setReviewed(item) }}>Xem đánh giá</button>
                        : ''}


                      {(item.trangThai === 'Hoàn thành' && tinhChenhLechNgay(item.ngayDat) < 4 && !reviews[item._id]) ?
                        <button className='text-white bg-green-500 hover:bg-green-700 my-auto rounded-md mx-2 p-1' onClick={e => { setReview(true), setReviewed(item) }}>Đánh giá</button>
                        : ''}
                    </div>
                  </div>
                </div>
                {item.expireAt && item.trangThai != 'Đã hủy' && <p className='italic ml-3'><span className='text-red-500'>* Đang chờ thanh toán đặt sân sẽ hủy vào lúc:</span>
                  <span>{formatDate(item.expireAt)}</span>
                  <a className='ml-4 font-bold underline text-blue-600 hover:text-blue-800' href={item.order_url}>Thanh toán ngay</a>
                </p>}
              </div> : ''
          )}
          {(filterFacility()?.length < 1) ? <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div> : ''}
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {/* from nhập dữ liệu */}
      {edit ? <Invoice toggle={setEdit} data={fac} /> : ''}
      {review ? <Feedback toggle={setReview} data={reviewed} /> : ''}
    </div>
  )
}

export default History