import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormFacilityManagement from '../components/FormFacilityManagement';
import FacilityService from '../services/facility.service';
import BookingService from '../services/booking.service';
import Pagination from'../components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FacilityManagement() {
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const facilityService = new FacilityService(user, dispatch);
  const bookingService = new BookingService(user, dispatch);

  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [fac, setFac] = useState({
    _id: "",
    ten_San: "",
    loai_San: "",
    tinhTrang: "",
    khuVuc: "",
    hinhAnh_San: "",
    bangGiaMoiGio: 0
  });
  const [search, setSearch] = useState('');

  // pHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(facilities.length / 4);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const handleFacility = async (data = {}) => {
    console.log(data);
    setFac(data)
    // !data._id
    //   ? setFac({
    //       _id: null,
    //       ten_San: "",
    //       loai_San: "",
    //       tinhTrang: "",
    //       khuVuc: "",
    //       hinhAnh_San: "",
    //       bangGiaMoiGio: 0,
    //     })
    //   : setFac(data) 
    if(data.phuongThuc == 'edit') {
      console.log('edit')
      if(await editFacility(data))
        console.log('Đã cập nhật');
      // setFac(fac)
    }
    if(data.phuongThuc == 'create') {
      console.log('create')
      if(await createFacility(data))
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
    return facilities.map((item) => {
      const { ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San } = item;
      return [ten_San, loai_San, tinhTrang, khuVuc, bangGiaMoiGio, hinhAnh_San, ngayTao_San, ngayCapNhat_San].join(" ").toLowerCase();
    });
  }
  // Lọc dữ liệu
  const filterFacility = () => {
    if(search == '') 
      return facilities;


    const searchTerms = search.toLowerCase().split(' ');
    const convertedStrings = convertString();
    console.log(convertedStrings)
    const filteredFacilities = facilities.filter((item, index) =>
      // Kiểm tra xem mỗi từ trong chuỗi tìm kiếm có tồn tại trong mảng đã chuyển đổi không
      searchTerms.every(term =>
        convertedStrings[index]?.includes(term) // Đảm bảo kiểm tra giá trị trước khi gọi includes
      )
    );
    return filteredFacilities;
  }

  // GỌI SERVICE BACKEND
  // lấy dữ liệu
  const getFacility = async () => {
    const data = await facilityService.getAll(user.accessToken);
    setFacilities(data);
    console.log('tải lại')
  }
  const createFacility = async (data) => {
    const newFac = await facilityService.create(data);
    return newFac;  
  }
  const editFacility = async (data) => {
    const today = await bookingService.getToday({sanId: data._id});
    if(today && today.length > 0) {
      for (const element of today) {
        element.san = data;
        await bookingService.update(element._id, element); // Use await with the update function here
      }
    }
    const editFac = await facilityService.update(data._id, data);
    setFac(fac)
    return editFac;
  }
  const deleteFacility = async (data) => {
    const today = await bookingService.getToday({sanId: data._id});
    if(today && today.length > 0) {
      toast.error('Không thể xóa !!!')
      return;
    }
    const confirm = window.confirm('Xác nhận xóa!!!');
    if(confirm) {
      const deleteFac = await facilityService.delete(data._id);
      return deleteFac;
    }
  }

  useEffect(() => {
    getFacility();
  }, [fac]);
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  return (
    <div className='facility'>
      <ToastContainer autoClose={2000} />
      <Header name="Quản lý Sân thể thao" />
      <div className="flex justify-between mb-3">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
       
        </div> 
        <button className="bg-blue-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-blue-700 w-10 h-10 m-auto rounded-xl"
                onClick={e => handleFacility()}
        >
          +
        </button>
      </div>
      <div className='flex pb-2'>
        {/* <div className='flex items-center'>
          <input name='' className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' type="date" value={''} onChange={''}/>
        </div>
        <div className='flex items-center'>
          Từ:
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' />
        </div>
        <div className='flex items-center'>
          Đến:
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' />
        </div> */}
      </div>
      {/* Lọc dữ liệu */}
      
      {/* Phân chia xem hiển thị dạng grid hay bảng */}
      
      <div className={`bg-white rounded-lg overflow-hidden shadow-md shadow-gray-600 border border-gray-300`}>
        {/* Header bảngg */}
        <div className="flex text-white p-4 bg-blue-500 justify-between pb-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          {/* <div className="hidden sm:block w-1/6 md:w-[10%] font-semibold">HÌNH ẢNH</div> */}
          <div className="w-1/6 font-semibold flex justify-center">
            TÊN
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            GIÁ MỖI GIỜ
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TÌNH TRẠNG
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>


        {/* Nội dung bảng */}
        {facilities ? filterFacility().map((facility, index) => 
        ((currentPage-1)*4 <= index && index < currentPage*4) ?
            <div key={facility._id} className={` p-4 text-sm md:text-base flex flex-grow justify-between py-2 border-b border-gray-300 text-center items-center ${index % 2 != 0 && 'bg-blue-100'}`}> 
            <div className="w-1/12">{ index+1 }</div>
            {/* <div className="w-1/6 md:w-[10%] hidden sm:block">
              {
              facility.hinhAnh_San 
              ? <img src={facility.hinhAnh_San} alt="" />
              : <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" alt="" />
              }
              </div> */}
            <div className="w-1/6">
              { facility.ten_San }
              <p className='lg:block'>Loại sân: {facility.loai_San.ten_loai}</p>
              <p className='md:block'>{facility.khuVuc}</p>
            </div>
            <div className="w-1/6">{ formatNumber(parseInt(facility.bangGiaMoiGio))}</div>
            <div className="w-1/6 flex">
              <p className={`m-auto p-1 ${facility.tinhTrang == 'Đang sử dụng' 
                                          ? 'text-white rounded-lg bg-green-500 w-full lg:w-1/2 shadow-md shadow-slate-500' 
                                          : facility.tinhTrang == 'Đã đặt' 
                                          ? 'text-white rounded-lg bg-blue-500 w-full md:w-1/2 shadow-md shadow-slate-500' 
                                          : facility.tinhTrang == 'Bảo trì' ? 'text-white rounded-lg bg-yellow-500 w-full lg:w-1/2 shadow-md shadow-slate-500' : ''}`}>
                { facility.tinhTrang }
              </p>
            </div>
            <div className="w-1/6 text-xl">
              <i className="ri-edit-box-line p-2 mr-2 bg-gray-300 rounded-md" onClick={e => handleFacility(facility)}></i>
              <i className="ri-delete-bin-2-line bg-red-600 text-white p-2 rounded-md" onClick={e => deleteFacility(facility)} ></i>
            </div>
          </div> 
        :'') : ''}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        {/* from nhập dữ liệu */}
      {edit ? <FormFacilityManagement toggle={setEdit} handleData={handleFacility} data={fac} /> : '' }
    </div>
  )
}

export default FacilityManagement