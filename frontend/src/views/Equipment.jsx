import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ServiceService from '../services/service.service';
import BookingService from '../services/booking.service';
import FormEquipment from '../components/FormEquipment';
import Pagination from '../components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Equipment = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const serviceService = new ServiceService(user, dispatch);
  const bookingService = new BookingService(user, dispatch);

  const [fac, setFac] = useState({});
  // Định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return list.map((item) => {
      return [item.ten_DV, item.so_luong, item.gia, item.ngayTao_DV].join(" ").toLowerCase();
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

  const totalPages = Math.ceil(filterFacility().length / 7);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleData = async (data = {}) => {
    setFac(data)
    if (data.phuongThuc == 'edit') {
      console.log('edit')
      if (await editData(data)) {
        console.log('Đã cập nhật');
        toast.success('Thành công');
      }
    }
    if (data.phuongThuc == 'create') {
      console.log('create')
      if (await createData(data)) {
        console.log('Đã thêm mới');
        toast.success('Thành công');
      }
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
    const findBooking = await bookingService.getByType(
      {
        "dichVu._id": data._id,
      }
    );

    if (findBooking && findBooking.length > 0) {
      toast.error('Không thể xóa!');
      return;
    }
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa không?');
    if (confirm) {
      const deleteFac = await serviceService.delete(data._id);
      getService();
      return deleteFac;
    }

  }
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getService();
  }, [list, fac]);


  return (
    <div>
      <ToastContainer autoClose='2000' />
      <Header name="Dịch vụ" />
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

        </div>
        <button className="bg-blue-500 ml-3 w-11 h-11 text-white cursor-pointer hover:bg-blue-700 m-auto rounded-lg shadow-xl text-2xl"
          onClick={e => handleData()}
        >
          +
        </button>
      </div>
      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] overflow-hidden sm:text-sm md:text-base rounded-lg shadow-sm border-2 border-gray-400">
        {/* Header bảngg */}
        <div className="flex bg-blue-500 p-4 px-6 pb-2 text-white justify-between border-b border-gray-300 text-center">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">TÊN DỊCH VỤ</div>

          <div className="w-1/6 font-semibold flex justify-center">
            GIÁ

          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            TỒN KHO

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
          ((currentPage - 1) * 7 <= index && index < currentPage * 7) ?
            <div key={index} className={`flex justify-between items-center p-4 px-6 min-h-14 max-h-16 border-b border-gray-300 text-center ${index % 2 != 0 && 'bg-blue-100'}`}>
              <div className="w-1/12">{index + 1}</div>
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


      {edit ? <FormEquipment toggle={setEdit} data={fac} handleData={handleData} /> : ''}
    </div>
  )
}

export default Equipment