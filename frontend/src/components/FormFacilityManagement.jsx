import React, { useState, useEffect } from 'react';
import SportTypeService from '../services/sportType.service';
import { useDispatch, useSelector } from 'react-redux';
function FromFacility(props) {
  const [data, setData] = useState(props.data);
  const [preImg, setPreImg] = useState(null);
  const [show, setShow] = useState(false);
  const [sportType, setSportType] = useState(null);
  const user = useSelector((state) => state.user.login.user);
  const dispatch = useDispatch();
  const sportTypeService = new SportTypeService(user, dispatch)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPreImg(base64);
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    data._id ? data.phuongThuc = 'edit' : data.phuongThuc = 'create';
    preImg ? data.hinhAnh_San = preImg : '';
    props.handleData(data); // Xử lý dữ liệu biểu mẫu
  };

  const getSportType = async () => {
    const spType = await sportTypeService.getAll();
    setSportType(spType);
  }



  useEffect(() => {
    setData(props.data);
    console.log(props.data)
    getSportType();
    setShow(true)
  }, [props.data]);

  return (
    <div className='absolute bg-opacity-30 bg-black left-0 flex top-0 w-full h-full' onClick={e => props.toggle(false)}>
      <form action="" className={`relative transition flex flex-col bg-white p-2 px-6 w-3/5 lg:w-5/12 rounded-md m-auto md:-translate-x-20+ ${show ? 'scale-100' : 'scale-0'}`} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
        <h1 className='text-center text-2xl font-bold p-5'>THÔNG TIN</h1>
        <div className="flex">
          <label htmlFor="" className='w-1/4'>Tên sân:</label>
          <input required name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ten_San} onChange={e => setData({ ...data, ten_San: e.target.value })} />
        </div>
        <div className="flex">
          <label htmlFor="" className='w-1/4'>Mã sân:</label>
          <input required name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ma_San} onChange={e => setData({ ...data, ma_San: e.target.value })} />
        </div>
        <div className="flex">
          <label htmlFor="" className='w-1/4'>Loại sân:</label>
          {/* <input required name='loai_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.loai_San} onChange={e => setData({...data, loai_San: e.target.value})}/> */}
          <select name="" id="" className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2'
            onChange={e => {
              const selectedItem = JSON.parse(e.target.value);
              console.log(e.target.value) // Parse chuỗi JSON thành đối tượng
              setData({ ...data, loai_San: selectedItem });
              // setData({...data, loai_San: e.target.value})
            }
            }
          >
            <option value="">{data?.loai_San?.ten_loai || 'Loại sân'}</option>
            {sportType?.map((item) =>
              <option key={item._id} value={JSON.stringify(item)}>{item.ten_loai}</option>
            )}
          </select>
        </div>
        {/* <div className="flex">
              <label htmlFor="" className='w-1/4'>Khu vực:</label>
              <input required name='khuVuc' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khuVuc} onChange={e => setData({...data, khuVuc: e.target.value})}/>
            </div> */}
        <div className="flex">
          <label htmlFor="" className='w-1/4'>Tình trạng:</label>
          {/* <input required name='khuVuc' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.tinhTrang} onChange={e => setData({...data, khuVuc: e.target.value})}/> */}
          <select name="khuVuc" className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' id="" onChange={e => setData({ ...data, tinhTrang: e.target.value })}>
            <option value={data.tinhTrang || 'Trạng thái'}>{data.tinhTrang || 'Trạng thái'}</option>
            <option value={'Trống'}>Trống</option>
            <option value={'Đang sử dụng'}>Đang sử dụng</option>
            <option value={'Đã đặt'}>Đã đặt</option>
            <option value={'Bảo trì'}>Bảo trì</option>
          </select>
        </div>
        <div className="flex">
          <label htmlFor="" className='w-1/4'>Giá mỗi giờ:</label>
          <input required name='bangGiaMoiGio' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="number" value={data.bangGiaMoiGio} onChange={e => setData({ ...data, bangGiaMoiGio: e.target.value })} />
        </div>
        {/* <div className="flex">
              <label htmlFor="" className='w-1/4'>Hình ảnh:</label>
              <div className='w-3/4 flex flex-col'>
                <img src={data.hinhAnh_San} alt="" className='w-1/2'/>
                <img src={preImg || ''} alt="" className='w-1/2'/>
                <label htmlFor="file-upload" className='bg-gray-300 hover:text-blue-900 hover:border-blue-500 cursor-pointer w-[90px] h-[80px] flex items-center justify-center text-4xl rounded-lg border border-dashed border-black'>
                  <i className="ri-image-add-fill"></i>
                </label>
                <input required id='file-upload' className='hidden' type="file" onChange={e => handleFileUpload(e)} />
              </div>
            </div> */}
        <button className='bg-blue-600 m-4 py-1 rounded-lg text-white hover:bg-blue-500'>Xác nhận</button>
      </form>
    </div>
  )
}

export default FromFacility;

const convertToBase64 = (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}