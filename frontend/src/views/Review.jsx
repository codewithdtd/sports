import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReviewService from '../services/review.service';
import Pagination from '../components/Pagination';
import FormReview from '../components/FormReview';

import { ExportReactCSV } from '../components/ExportReactCSV';

const Review = () => {
  const [list, setList] = useState([]);
  const [listCSV, setListCSV] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [merge, setMerge] = useState(false)
  const [listMerge, setListMerge] = useState([])
  const [isChecked, setIsChecked] = useState({});

  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reviewService = new ReviewService(user, dispatch);

  const [fac, setFac] = useState({});
  // Định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return list.map((item) => {
      const { ho_KH, ten_KH, email_KH, sdt_KH } = item.khachHang;
      const { danhGia, noiDung, ngayTao_DG } = item;
      return [ ho_KH, ten_KH, email_KH, sdt_KH,  danhGia, noiDung, ngayTao_DG ].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if(search == '') 
      return list.filter((item) => item.danhGia);

    const searchTerms = search.toLowerCase().split(' ');
    const convertedStrings = convertString();
    const filteredlist = list.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      ) && item.danhGia
    );
    return filteredlist;
  }

  const totalPages = Math.ceil(filterFacility().length / 5);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleData = async (data = {}) => {
    setFac(data);
    setEdit(!edit);  
  };


  // Lấy dữ liệu từ server
  const getInvoice = async () => {
    const data = await reviewService.getAll();
    setList(data);
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getInvoice();
  }, []);
  return (
    <div className='review'>
      <Header name="Quản lý đánh giá" />
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => { setSearch(e.target.value), setCurrentPage(1) } } />
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
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] sm:text-sm md:text-base p-4 rounded-lg shadow-sm border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>
          
          
          <div className="w-1/6 font-semibold flex justify-center">
            ĐÁNH GIÁ
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/3 font-semibold flex justify-center">
            NỘI DUNG
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            NGÀY
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
        ((currentPage-1)*5 <= index && index < currentPage*5) ?
        <div key={index} className="flex justify-between items-center min-h-20 max-h-24 py-2 border-b border-gray-300 text-center">
          <div className="w-1/12">{index+1}</div>
          <div className="w-1/6">
          {item.khachHang?.ho_KH +' '} {item.khachHang?.ten_KH}
          <p>{item.khachHang.sdt_KH}</p>
          </div>
          
          <div className={`w-1/6 flex justify-center`}>
            <div className={`p-1 px-3 rounded-md flex justify-center ${item.danhGia === 'Tốt' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
              {item.danhGia} 
              { item.danhGia === 'Tốt' ?  <i className="pl-1 ri-thumb-up-fill"></i> : <i className="pl-1 ri-thumb-down-fill"></i>}
            </div>
          </div>
          <div className="w-1/3 flex justify-center content">
            {item.noiDung}
          </div>
          <div className="w-1/6 flex justify-center">
            {item.ngayTao_DG}
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
      {merge ? <button className='float-end border text-green-600 rounded-md border-green-500 p-1 m-1' onClick={e => {if(listMerge.length > 0) setEdit(!edit)}}>Xuất hóa đơn</button> : ''}
      </div>

      {/* Phân trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />


    
      {edit ? <FormReview toggle={setEdit} data={fac} listData={listMerge} /> : '' }
      
    </div>
  )
}

export default Review