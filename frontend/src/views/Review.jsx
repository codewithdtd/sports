import React, { useEffect, useState } from 'react'
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

  const user = useSelector((state) => state.user.login.user)
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
      return [ho_KH, ten_KH, email_KH, sdt_KH, danhGia, noiDung, ngayTao_DG].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if (search == '')
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
  const editReview = async (item) => {
    item.da_an = !item.da_an;
    const edit = await reviewService.update(item._id, item);
    setFac(fac);
    getInvoice();
  }
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getInvoice();
  }, [fac]);
  return (
    <div className='review'>
      <Header name="Đánh giá" />
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => { setSearch(e.target.value), setCurrentPage(1) }} />
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] overflow-hidden sm:text-sm md:text-base rounded-lg shadow-sm border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between bg-blue-500 text-white p-4 pb-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">KHÁCH HÀNG</div>


          <div className="w-1/6 font-semibold flex justify-center">
            ĐÁNH GIÁ

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
          ((currentPage - 1) * 5 <= index && index < currentPage * 5) ?
            <div key={index} className={`flex justify-between items-center min-h-20 max-h-24 p-4 border-b border-gray-300 text-center ${index % 2 != 0 && 'bg-blue-100'}`}>
              <div className="w-1/12">{index + 1}</div>
              <div className="w-1/6">
                {item.khachHang?.ho_KH + ' '} {item.khachHang?.ten_KH}
                <p>{item.khachHang.sdt_KH}</p>
              </div>

              <div className={`w-1/6 flex justify-center`}>
                <div className={`p-1 px-3 rounded-md flex justify-center ${item.danhGia === 'Tốt' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {item.danhGia}
                  {item.danhGia === 'Tốt' ? <i className="pl-1 ri-thumb-up-fill"></i> : <i className="pl-1 ri-thumb-down-fill"></i>}
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
                  <>
                    <i className="ri-eye-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(item)}></i>
                    {!item.da_an ? <button className='bg-red-500 p-1 px-3 rounded-md text-white' onClick={e => editReview(item)}>Ẩn</button> : <button className='bg-blue-500 p-1 px-3 rounded-md text-white' onClick={e => editReview(item)}>Hiện</button>}
                  </>
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
        {merge ? <button className='float-end border text-green-600 rounded-md border-green-500 p-1 m-1' onClick={e => { if (listMerge.length > 0) setEdit(!edit) }}>Xuất hóa đơn</button> : ''}
      </div>

      {/* Phân trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />



      {edit ? <FormReview toggle={setEdit} data={fac} listData={listMerge} /> : ''}

    </div>
  )
}

export default Review