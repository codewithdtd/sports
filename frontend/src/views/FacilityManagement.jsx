import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FromFacilityManagement from '../components/FromFacilityManagement';
import facilityService from '../services/facility.service';
import Pagination from'../components/Pagination';
function FacilityManagement() {
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();

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

  const backgroundSan = (data) => {
    console.log(data)
    switch (data) {
      case 'Bóng đá':
        return './src/assets/img/soccer.jpg';
      case 'Bóng rổ':
        return './src/assets/img/basketball.jpg';
      case 'Bóng chuyền':
        return './src/assets/img/volleyball.jpg';
      case 'Cầu lông':
        return './src/assets/img/badminton.jpg';
      default: 
        break;
    }
  } 

  const handleFacility = async (data = {}) => {
    console.log(data);
    (data != {})
      ? setFac(data) 
      : setFac({
          _id: null,
          ten_San: "",
          loai_San: "",
          tinhTrang: "",
          khuVuc: "",
          hinhAnh_San: "",
          bangGiaMoiGio: 0,
        });
    if(data.phuongThuc == 'edit') {
      console.log('edit')
      if(await editFacility(data))
        console.log('Đã cập nhật');
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
    const editFac = await facilityService.update(data._id, data);
    return editFac;
  }
  const deleteFacility = async (data) => {
    const deleteFac = await facilityService.delete(data._id);
    return deleteFac;
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
      <Header name="Quản lý Sân thể thao" />
      <div className="flex justify-between mb-3">
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
                onClick={e => handleFacility()}
        >
          +
        </button>
      </div>
      <div className='flex pb-2'>
        <div className='flex items-center'>
          <input name='' className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' type="date" value={''} onChange={''}/>
        </div>
        <div className='flex items-center'>
          Từ:
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' />
        </div>
        <div className='flex items-center'>
          Đến:
          <input type="time" className='flex-1 border border-gray-400 rounded-xl p-1 pl-2' />
        </div>
      </div>
      {/* Lọc dữ liệu */}
      
      {/* Phân chia xem hiển thị dạng grid hay bảng */}
      
      <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-300`}>
        {/* Header bảngg */}
        <div className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="hidden sm:block w-1/6 md:w-[10%] font-semibold">HÌNH ẢNH</div>
          <div className="w-1/6 font-semibold flex justify-center">
            TÊN
            <div className="">
              <i className={''}></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            GIÁ MỖI GIỜ
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TÌNH TRẠNG
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              <i className="ri-arrow-down-fill"></i>
            </div>
          </div>
          <div className="w-1/6">
            <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i>
          </div>
        </div>


        {/* Nội dung bảng */}
        {facilities ? filterFacility().map((facility, index) => 
        ((currentPage-1)*4 <= index && index < currentPage*4) ?
          <div key={facility._id} className="hover:bg-slate-200 text-sm md:text-base flex flex-grow justify-between py-2 border-b border-gray-300 text-center items-center"> 
            <div className="w-1/12">{ index+1 }</div>
            <div className="w-1/6 md:w-[10%] hidden sm:block">
              {
              facility.hinhAnh_San 
              ? <img src={facility.hinhAnh_San} alt="" />
              : <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" alt="" />
              }
              </div>
            <div className="w-1/6">
              { facility.ten_San }
              <p className='hidden lg:block'>Loại sân: {facility.loai_San}</p>
              <p className='hidden md:block'>{facility.khuVuc}</p>
            </div>
            <div className="w-1/6">{ formatNumber(parseInt(facility.bangGiaMoiGio))}</div>
            <div className="w-1/6 flex">
              <p className={`m-auto p-1 ${facility.tinhTrang == 'Đang sử dụng' ? 'text-white rounded-lg bg-green-600 w-full lg:w-1/2 shadow-md shadow-slate-500' : facility.tinhTrang == 'Đã đặt' ? 'text-white rounded-lg bg-blue-500 w-full md:w-1/2 shadow-md shadow-slate-500' : ''}`}>
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
      {edit ? <FromFacilityManagement toggle={setEdit} handleData={handleFacility} data={fac} /> : '' }
    </div>
  )
}

export default FacilityManagement