import React, { useState, useEffect } from 'react'

function FromFacility(props) {
  const [data, setData] = useState(props.data);
  const [preImg, setPreImg] = useState(null);
  const [show, setShow] = useState(false);

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



  useEffect(() => {
    setData(props.data);
    setShow(true)
  }, [props.data]);

  return (
     <div className='absolute z-10 bg-opacity-30 bg-black -translate-x-2 flex top-0 w-full h-full' onClick={e => props.toggle(false)}>
        <form action="" className={`relative transition flex flex-col lg:flex-row bg-white p-2 px-6 w-[95%] lg:w-2/3 rounded-md m-auto md:-translate-x-20 ${show ? 'scale-100' : 'scale-0'}`} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <div className='flex-1'>
            <h1 className='text-center text-2xl font-bold pt-5 pb-2'>SÂN BD5S1</h1>
              <div className='flex justify-between text-sm border-b border-gray-400 mb-3 italic'>
                <p>Nhân viên: Nguyễn Văn Web</p>
                <p>02/09/2024 02:09PM</p>
                <p>Chức vụ: Nhân viên</p>
              </div>
              <div className="flex">
                <div className='flex-1 text-sm sm:text-base'>
                  <div className='flex'>
                    <p className='w-2/5'>Khách hàng:</p>
                    <span className=''>Đỗ Thành Đạt</span>
                  </div>
                  <div className='flex'>
                    <p className='w-2/5'>Số điện thoại:</p>
                    <span className=''>0111 222 333</span>
                  </div>
                  <div className='flex'>
                    <p className='w-2/5'>Hội viên:</p>
                    <span className=''>VIP</span>
                  </div>
                </div>
                <div className='flex-1 text-sm sm:text-base'>
                  <div className='flex'>
                    <p className='w-2/5'>Mã sân:</p>
                    <span className=''>BD5S1</span>
                  </div>
                  <div className='flex'>
                    <p className='w-2/5'>Thời gian:</p>
                    <div className='flex flex-col'>
                      <span className=''>17:00 - 19:00 (2 giờ)</span> 
                    </div>
                  </div>
                  <div className='flex'>
                    <p className='w-2/5'>Ngày đặt:</p>
                    <span className=''>30/08/2024 09:05:25</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center'>
                <p>Thời gian nhận sân: --:--</p>
              </div>
                <p>Thời gian trả sân: --:--</p>
              {/* Bảng dịch vụ */}
              <div className='flex-1'>
                <div className='flex text-center font-bold bg-gray-400'>
                    <div className="flex-1 border border-gray-300">Tên</div>
                    <div className="flex-1 border border-gray-300">Số lượng</div>
                    <div className="flex-1 border border-gray-300">Giá</div> 
                </div>
                <div className='flex text-center'>
                    <div className="flex-1 border border-gray-400">Cầu</div>
                    <div className="flex-1 border border-gray-400">1</div>
                    <div className="flex-1 border border-gray-400">15.000</div> 
                </div>
              </div>
                  <button className='bg-green-600 flex-1 m-4 py-1 rounded-lg text-white hover:bg-green-500'>+ Thêm dịch vụ</button>
              <div className='flex'>
                  <button className='border-green-600 flex-1 border m-4 px-3 py-1 rounded-lg font-bold text-green-600 hover:bg-green-500 hover:text-white'>Nhận sân</button>
                  <button className='border-gray-600 flex-1 bg-gray-200 border px-3 m-4 py-1 rounded-lg font-bold text-gray-600 hover:bg-gray-500 hover:text-white'>Trả sân</button>
                  <button className='bg-green-600 m-4 flex-1 py-1 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
              </div>
            </div>
            <div className='m-4 flex-1 flex flex-col'>
              Chọn: <input type="text"className='border'/>
              <div className='flex-1 bg-slate-200'>     
                <div className='flex text-center font-bold bg-gray-400'>
                    <div className="flex-1 border border-gray-300">Tên</div>
                    <div className="flex-1 border border-gray-300">Số lượng</div>
                    <div className="flex-1 border border-gray-300">Giá</div> 
                </div>
                <div className='flex text-center'>
                    <div className="flex-1 border border-gray-400">Cầu</div>
                    <div className="flex-1 border border-gray-400">1</div>
                    <div className="flex-1 border border-gray-400">15.000</div> 
                </div>
              </div>
              <div className='flex-1'>
                Đã chọn:
                <div className='flex text-center font-bold bg-gray-400'>
                    <div className="flex-1 border border-gray-300">Tên</div>
                    <div className="flex-1 border border-gray-300">Số lượng</div>
                    <div className="flex-1 border border-gray-300">Giá</div> 
                </div>
                <div className='flex text-center'>
                    <div className="flex-1 border border-gray-400">Cầu</div>
                    <div className="flex-1 border border-gray-400">1</div>
                    <div className="flex-1 border border-gray-400">15.000</div> 
                </div>
              </div>
            </div>
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