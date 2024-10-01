import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Booking from '../services/booking.service';
import invoiceService from '../services/invoice.service';
import reviewService from '../services/review.service';
import Pagination from '../components/Pagination';
import Invoice from '../components/Invoice';
import Feedback from '../components/Feedback';

const History = () => {
  const user = useSelector((state)=> state.user.login.user)
  const accessToken = user?.accessToken; 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingService = new Booking(user, dispatch);
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  const [review, setReview] = useState(false);
  const [reviewed, setReviewed] = useState(null);
  const [reviews, setReviews] = useState({}); 
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


  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getBooking = async () => {
    const id = { id: user.user._id }
    const data = await bookingService.getAll(id, accessToken, dispatch);
    const invoice = await invoiceService.getAll(user.user._id)
    setList(data.reverse());
    setListInvoice(invoice)
  }
  const createBooking = async (data) => {
    const newFac = await bookingService.create(data);
    return newFac;  
  }
  const editBooking = async (data) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy sân?");
    if (isConfirmed) {
      data.trangThai = 'Đã hủy';
      const editFac = await bookingService.update(data._id, data);
      setFac(edit)
      return editFac;
    }
  }

  const getReview = async (id) => {
    try {
        const datSan = { 'datSan._id': id }
        const review = await reviewService.getOne(datSan)
        if(review) {
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
      <h1 className='text-2xl font-bold text-center'>LỊCH SỬ ĐẶT SÂN</h1>
      <div className='px-4'>
        <div className='flex-1 flex justify-between py-5'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div> 
        <div className='shadow-gray-600 shadow-md rounded-lg'>
          <div className="flex justify-between py-2 bg-green-500 border-b border-gray-300 text-center rounded-t-lg">
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
          <div key={index} className="flex items-center justify-between py-2 mb-3 shadow-md shadow-gray-400 border-b border-gray-300 text-center min-h-32">
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
            <div className="w-1/6 flex justify-center h-fit">
              <p className={`${item.trangThai == 'Hoàn thành' ? 'text-green-700 rounded-lg bg-green-200 border-green-500 border-2 shadow-md ' 
                : item.trangThai == 'Đã hủy' ? 'text-red-700 rounded-lg bg-red-300 border-red-500 border-2 shadow-md ' 
                : item.trangThai == 'Đã duyệt' ? 'text-blue-700 rounded-lg bg-blue-300 border-blue-500 border-2 shadow-md ' 
                : item.trangThai == 'Nhận sân' ? 'text-yellow-700 rounded-lg bg-yellow-300 border-yellow-600 border-2 shadow-md ' 
                : 'rounded-lg'} w-fit px-1 md:px-3`}>
                {item.trangThai}
              </p>
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
              <button className='bg-red-500 text-white px-2 hover:bg-red-700 p-1 rounded-md mx-2' onClick={e => editBooking(item)}>Hủy sân</button>
              : ''}
              {/* Hiển thị kết quả của getReview() */}
              {reviews[item._id] ?
                <button className='border-gray-500 text-gray-600 border hover:bg-gray-300 p-1 rounded-md mx-2' onClick={e => {setReview(true), setReviewed(item)}}>Xem đánh giá</button>
              : ''}


              {(item.trangThai === 'Hoàn thành' && tinhChenhLechNgay(item.ngayDat) < 4) ? 
              <button className='text-white bg-green-500 hover:bg-green-700 p-1 rounded-md mx-2' onClick={e => {setReview(true), setReviewed(item)}}>Đánh giá</button>
              : ''}
            </div>
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
      {edit ? <Invoice toggle={setEdit} data={fac} /> : '' }
      { review ? <Feedback toggle={setReview} data={reviewed} /> : '' }
    </div>
  )
}

export default History