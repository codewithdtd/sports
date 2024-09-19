import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import serviceService from '../services/service.service';
import FormEquipment from '../components/FormEquipment';
import Pagination from '../components/Pagination';
const Equipment = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      return [ item.ten_DV, item.so_luong, item.gia, item.ngayTao_DV ].join(" ").toLowerCase();
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
    setFac(data)
    if(data.phuongThuc == 'edit') {
      console.log('edit')
      if(await editData(data))
        console.log('Đã cập nhật');
    }
    if(data.phuongThuc == 'create') {
      console.log('create')
      if(await createData(data))
        console.log('Đã thêm mới');
    }
    // setFac(fac);
    setEdit(!edit);  
  };

  // Lấy dữ liệu từ server
  const getService = async () => {
    const data = await serviceService.getAll();
    setList(data);
  }
  const createData = async (data) => {
    const newFac = await serviceService.create(data);
    return newFac;  
  }
  const editData = async (data) => {
    const editFac = await serviceService.update(data._id, data);
    return editFac;
  }
  const deleteData = async (data) => {
    const deleteFac = await serviceService.delete(data._id);
    return deleteFac;
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getService();
  }, [list, fac]);


  return (
    <div>
      <Header name="Quản lý kho" />
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
        <button className="bg-green-500 ml-3 w-11 h-11 text-white cursor-pointer hover:bg-green-700 m-auto rounded-lg shadow-xl text-2xl"
              onClick={e => handleData()}
        >
          +
        </button>
      </div>
      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] sm:text-sm md:text-base p-4 rounded-lg shadow-sm border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between py-2 border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">TÊN DỊCH VỤ</div>
          
          <div className="w-1/6 font-semibold flex justify-center">
            GIÁ
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỒN KHO
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              {/* <i className="ri-arrow-down-fill"></i> */}
            </div>
          </div>
          {/* <div className="w-1/6 font-semibold flex justify-center">
            CHO MƯỢN
            <div className="">
              <i className="ri-arrow-up-fill"></i>
              
            </div>
          </div> */}
          <div className="w-1/6 font-semibold flex justify-center">
          </div>
        </div>
        {list.length > 0 ? filterFacility()?.map((item, index) =>
        ((currentPage-1)*7 <= index && index < currentPage*7) ?
        <div key={index} className="flex justify-between items-center min-h-14 max-h-16 py-2 border-b border-gray-300 text-center">
          <div className="w-1/12">{index+1}</div>
          <div className="w-1/6">{item.ten_DV}</div>
          <div className="w-1/6 flex justify-center">
            {formatNumber(item.gia)}
          </div>
          <div className="w-1/6 flex justify-center">
            {item.tonKho || 0}
          </div>
          {/* <div className="w-1/6 flex justify-center">
            {item.choMuon || 0}
          </div> */}
          <div className="w-1/6">
            <i className="ri-edit-box-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(item)}></i>
            <i className="ri-delete-bin-2-line bg-red-600 text-white p-2 rounded-md" onClick={e => deleteData(item)} ></i>
          
          </div>
        </div>
        : '') : <div className="py-2 border-b border-gray-300 text-center items-center">Chưa có dữ liệu</div>
        }
      </div>


      {/* Phân trang */}
      <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

    
      {edit ? <FormEquipment toggle={setEdit} data={fac} handleData={handleData}/> : '' }
    </div>
  )
}

export default Equipment