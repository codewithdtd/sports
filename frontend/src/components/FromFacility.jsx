import React, { useState, useEffect } from 'react'

function FromFacility(props) {
  const [data, setData] = useState(props.data);

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    data._id ? data.phuongThuc = 'edit' : data.phuongThuc = 'create'
    props.handleData(data); // Xử lý dữ liệu biểu mẫu
  };

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  return (
     <div className='absolute bg-opacity-30 bg-black -translate-x-2 flex top-0 w-full h-full' onClick={e => props.toggle(false)}>
        <form action="" className='relative flex flex-col bg-white p-2 px-6 w-3/5 lg:w-1/4 rounded-md m-auto md:-translate-x-20' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <h1 className='text-center text-2xl font-bold p-5'>THÔNG TIN</h1>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Tên sân:</label>
              <input name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ten_San} onChange={e => setData({...data, ten_San: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Loại sân:</label>
              <input name='loai_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.loai_San} onChange={e => setData({...data, loai_San: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Khu vực:</label>
              <input name='khuVuc' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.khuVuc} onChange={e => setData({...data, khuVuc: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Giá mỗi giờ:</label>
              <input name='bangGiaMoiGio' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="number" value={data.bangGiaMoiGio} onChange={e => setData({...data, bangGiaMoiGio: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Hình ảnh:</label>
              <label htmlFor="file-upload" className='bg-gray-300 hover:text-blue-900 hover:border-blue-500 cursor-pointer w-[90px] h-[80px] flex items-center justify-center text-4xl rounded-lg border border-dashed border-black'>
                <i className="ri-image-add-fill"></i>
              </label>
              <input id='file-upload' className='hidden' type="file" />
            </div>
            <button className='bg-green-600 m-4 py-1 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
        </form>
    </div>
  )
}

export default FromFacility