import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StaffService from '../services/staff.service';
import Pagination from '../components/Pagination';
import FormStaff from '../components/FormStaff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Staff = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = user.accessToken;

  const staffService = new StaffService(user, dispatch);

  const [fac, setFac] = useState({});
  // Định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return list.map((item) => {
      return [item.ho_NV, item.sdt_NV, item.ten_NV, item.email_NV, item.chuc_vu].join(" ").toLowerCase();
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
      if (await editData(data))
        console.log('Đã cập nhật');
    }
    if (data.phuongThuc == 'create') {
      console.log('create')
      if (await createData(data))
        console.log('Đã thêm mới');
    }
    // setFac(fac);
    setEdit(!edit);
  };

  // Lấy dữ liệu từ server
  const getService = async () => {
    const data = await staffService.getAll(accessToken);
    setList(data);
  }
  const createData = async (data) => {
    const newFac = await staffService.create(data);
    setFac(fac);
    return newFac;
  }
  const editData = async (data) => {
    const editFac = await staffService.update(data._id, data, accessToken);
    setFac(fac);
    return editFac;
  }
  const deleteData = async (data) => {
    const confirm = window.confirm('Xác nhận xóa!!!');
      if (confirm) {
      const deleteFac = await staffService.delete(data._id);
      setFac(fac);
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
  }, [fac]);

  return (
    <div>
      <Header name="Quản lý nhân viên" />
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <button className="bg-blue-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-blue-700 w-10 h-10 m-auto rounded-xl"
              onClick={e => handleData()}
            >
              +
            </button>
          </div>
        </div>

      </div>
      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] sm:text-sm md:text-base rounded-md overflow-hidden shadow-md shadow-gray-400 border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between py-3 border-b border-gray-300 text-center bg-blue-500 text-white">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">TÊN</div>

          <div className="w-1/6 font-semibold flex justify-center">
            SỐ ĐIỆN THOẠI

          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            EMAIL
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
            CHỨC VỤ
          </div>
          <div className="w-1/6 font-semibold flex justify-center">
          </div>
        </div>
        {list.length > 0 ? filterFacility()?.map((item, index) =>
          ((currentPage - 1) * 7 <= index && index < currentPage * 7) ?
            <div key={index} className={`flex justify-between items-center min-h-14 max-h-16 py-2 border-b border-gray-300 text-center ${index % 2 != 0 && 'bg-blue-100'}`}>
              <div className="w-1/12">{index + 1}</div>
              <div className="w-1/6">{item.ho_NV} {item.ten_NV}</div>
              <div className="w-1/6 flex justify-center">
                {item.sdt_NV}
              </div>
              <div className="w-1/6 flex justify-center">
                {item.email_NV}
              </div>
              <div className="w-1/6 flex justify-center">
                {item.chuc_vu}
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


      {edit ? <FormStaff toggle={setEdit} data={fac} handleData={handleData} /> : ''}
    </div>
  )
}

export default Staff