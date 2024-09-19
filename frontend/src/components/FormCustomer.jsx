import React, { useState } from 'react'

const FormCustomer = (props) => {
  const [data, setData] = useState(props.data)
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    data._id ? data.phuongThuc = 'edit' : data.phuongThuc = 'create';
    props.handleData(data); // Xử lý dữ liệu biểu mẫu
  };


  return (
    <div className='bg-black bg-opacity-50 w-full h-full absolute flex top-0 left-0' onClick={e => props.toggle(false)}>
        <form className='bg-white md:w-2/5 w-3/5 relative m-auto print p-4 rounded-lg justify-center' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <h1 className="font-bold text-2xl text-center p-2">KHÁCH HÀNG</h1>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Họ:</label>
              <input name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ho_KH} onChange={e => setData({...data, ho_KH: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Tên:</label>
              <input name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ten_KH} onChange={e => setData({...data, ten_KH: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Số điện thoại:</label>
              <input name='ten_San' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.sdt_KH} onChange={e => setData({...data, sdt_KH: e.target.value})}/>
            </div>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Email:</label>
              <input name='ten_San' min={0} className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="email" value={data.email_KH} onChange={e => setData({...data, email_KH: e.target.value})}/>
            </div>
            {/* <div className="flex">
              <label htmlFor="" className='w-1/4'>Cho mượn:</label>
              <input name='ten_San' min={0}  className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="number" value={data.choMuon || 0} onChange={e => setData({...data, choMuon: e.target.value})}/>
            </div> */}
            <button className='bg-green-600 w-full py-1 px-2 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
        </form>
    </div>
  )
}

export default FormCustomer