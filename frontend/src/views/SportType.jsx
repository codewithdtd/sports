import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SportTypeService from '../services/sportType.service';
import FacilityService from '../services/facility.service';
import Pagination from '../components/Pagination';
import FormSportType from '../components/FormSportType';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SportType = () => {
  const user = useSelector((state)=> state.user.login.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sportTypeService = new SportTypeService(user, dispatch)
  const facilityService = new FacilityService(user, dispatch)

  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  const [fac, setFac] = useState({});


  const handleData = async (data = {}) => {
    (data)
      ? setFac(data) 
      : setFac({
        ten_loai: "",
        hinhAnh: [],
        hinhAnhDaiDien: '',
        ngayTao: "",
      });
    if (data instanceof FormData) {
      console.log([...data])
      const phuongThuc = data.get('phuongThuc');
      if(phuongThuc == 'edit') {
        console.log('edit')
        if(await editData(data)) {
          toast.success('Đã cập nhật');
        }
      } 
      else
        if(phuongThuc == 'create') {
          console.log('create')
          if(await createData(data))
            toast.success('Đã thêm mới');
        } else {
          toast.error('Đã có lỗi xảy ra')
        }
    }
    setEdit(!edit);  

  };
  // Chuyển đổi thành dạng chuỗi
  const convertString = () => {
    return list.map((item) => {
      return [ item.ten_loai ].join(" ").toLowerCase();
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
  // const totalPages = 7;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Lấy dữ liệu từ server
  const getData = async () => {
    const data = await sportTypeService.getAll();
    setList(data);
  }
  const createData = async (data) => {
    const newFac = await sportTypeService.create(data);
    setFac(fac);
    return newFac;  
  }
  const editData = async (data) => {
    const id = data.get('_id');
    const editFac = await sportTypeService.update(id, data);

    const fields = await facilityService.getByType({
      'loai_San._id': data.get('_id')
    });
    console.log(fields)

    if (fields && fields.length > 0) {
      for (const element of fields) {
        element.loai_San.ten_loai = data.get('ten_loai');
        console.log(element)
        await facilityService.update(element._id, element); // Use await with the update function here
      }
    }

    setFac(fac)
    return editFac;
  }
  const deleteData = async (data) => {
    const fields = await facilityService.getByType({
      'loai_San._id': data._id
    });
    if(fields && fields?.length > 0) {
      toast.error('Không thể xóa do có sân đang tồn tại!!!');
      return;
    }
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa không?');
    if(confirm) {
      const editFac = await sportTypeService.delete(data._id, data);
      getData();
      return editFac;
    }
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    getData();
  }, [fac]);
  return (
    <div>
      <ToastContainer autoClose='2000' />
      <Header name="Loại sân"/>
      <div className="flex justify-between mb-5">
        <div className='flex-1 flex relative justify-between'>
          <div className="bg-white border flex-1 max-w-[30%] border-black shadow-gray-500 shadow-sm rounded-full overflow-hidden p-2">
            <i className="ri-search-line font-semibold"></i>
            <input className='pl-2 w-[85%]' type="text" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div> 
        <button className="bg-blue-500 ml-3 text-white font-bold text-2xl cursor-pointer hover:bg-blue-700 w-10 h-10 m-auto rounded-xl"
                onClick={e => handleData()}
        >
          +
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white text-[10px] overflow-hidden sm:text-sm md:text-base rounded-lg shadow-sm shadow-gr border border-gray-300">
        {/* Header bảngg */}
        <div className="flex justify-between p-4 pb-2 bg-blue-500 border-b border-gray-400 text-center text-white">
          <div className="w-1/12 font-semibold">STT</div>
          <div className="w-1/6 font-semibold">LOẠI SÂN</div>
          <div className="w-1/6 font-semibold flex justify-center">
            ẢNH ĐẠI DIỆN
          </div>
          <div className="flex-1 font-semibold flex justify-center">
            HÌNH ẢNH
          </div>
          <div className="w-1/6">
            {/* <i className="ri-reset-left-line border border-black p-2 rounded-lg"></i> */}
          </div>
        </div>

        {/* List dữ liệu */}
        {list.length > 0 ? filterFacility()?.map((item, index) =>
        ((currentPage-1)*7 <= index && index < currentPage*7) ?
        <div key={index} className="hover:bg-gray-200 flex p-4 justify-between items-center min-h-14 max-h-20 border-b border-gray-300 text-center">
          <div className="w-1/12">{index+1}</div>
          <div className="w-1/6">{item.ten_loai}</div>
          <div className="w-1/6 ">
            <img src={`http://localhost:3000/uploads/${item.hinhAnhDaiDien}`} className='object-contain m-auto max-h-16' alt="" />
          </div>
          <div className="flex-1 flex justify-center">
            {item.hinhAnh?.map((img, index) => 
                <img key={index} src={`http://localhost:3000/uploads/${img}`} alt="" className='max-h-10 border border-gray-400 mx-1 object-contain' />
            )}
          </div>
          <div className="w-1/6">
            <i className="ri-edit-box-line p-2 w-[40px] h-[40px] mr-2 bg-gray-300 rounded-md" onClick={e => handleData(item)}></i>
            <i className="ri-delete-bin-2-line w-[40px] h-[40px] bg-red-600 text-white p-2 rounded-md" onClick={e => deleteData(item)} ></i>
          </div>
        </div>
        : '') : <div className="py-2 border-b border-gray-400 text-center items-center">Chưa có dữ liệu</div>
        }
        
      </div>

      {/* Phân trang */}
      <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

      {edit ? <FormSportType bookingList={list} toggle={setEdit} handleData={handleData} data={fac} /> : '' }

    </div>
  )
}

export default SportType