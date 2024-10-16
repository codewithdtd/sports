import React from 'react'

const Invoice = (props) => {
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  return (
    <div className='w-full flex h-full bg-black bg-opacity-70 absolute top-0'  onClick={e => props.toggle(false)}>
      <div className='relative bg-white m-auto print p-6 px-8 rounded-lg text-center' onClick={e => e.stopPropagation()}>
        <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
        <div className='flex justify-between mb-10'>
          <div className="logo flex items-center text-4xl font-bold italic text-blue-700">
            <img src="./src/assets/logo.svg" alt="" className='md:w-3/4' />
            <span className='md:block hidden'>DSOPRT</span>
          </div>
          <div>
            <h1 className='text-center font-bold text-5xl text-blue-700'>HÓA ĐƠN</h1>
            <p className='text-sm font-medium'>Mã hóa đơn: {props.data._id}</p>
          </div>
        </div>
        <div className='flex text-start justify-between gap-16 text-xl'>
          <div>
            <p className='p-1'>Khách hàng: {props.data.khachHang.ho_KH } {props.data.khachHang.ten_KH }</p>
            <p className='p-1'>Số điện thoại: {props.data.khachHang.sdt_KH } </p>
            <p className='p-1'>Email: {props.data.khachHang.email_KH } </p>
            <p className='p-1'>Thời gian: {props.data.datSan.thoiGianBatDau } - {props.data.datSan.thoiGianKetThuc }</p>
            <p className='p-1'>Ngày đặt: {props.data.datSan.ngayDat }</p>
          </div>
          <div>
            <p className='p-1'>Nhân viên: {props.data.nhanVien.ho_NV } {props.data.nhanVien.ten_NV }</p>
            <p className='p-1'>Phương thức: {props.data.phuongThucThanhToan} </p>
            <p className='p-1'>Ngày tạo: {props.data.ngayTao_HD} </p>
            <p className='p-1'>Check-in: {props.data.datSan.thoiGianCheckIn }</p>
            <p className='p-1'>Check-out: {props.data.datSan.thoiGianCheckOut }</p>
          </div>
        </div>
        <div className='gap-14 text-xl pt-5'>
          <div className='flex justify-around text-center font-bold bg-blue-400'>
            <p className='p-1 w-full'>TÊN</p>
            <p className='p-1 w-full'>SỐ LƯỢNG</p>
            <p className='p-1 w-full'>GIÁ</p>
          </div>
          <div>
            <div className='flex justify-around text-center'>
                <p className={`p-1 w-full`}>{props.data.datSan.san.ma_San}</p>
                <p className={`p-1 w-full`}>1</p>
                <p className={`p-1 w-full`}>{formatNumber(props.data.datSan.san.bangGiaMoiGio)}</p>
            </div>
            {props.data.datSan.dichVu?.map((item, idx) => 
            <div className={`flex justify-around text-center items-center ${idx % 2 == 0 ? 'bg-blue-200' : ''}`}>
                <p className={`p-1 w-full`}>{item.ten_DV}</p>
                <p className={`p-1 w-full`}>{item.soluong}</p>
                <p className={`p-1 w-full`}>{formatNumber(item.thanhTien)}</p>
            </div>
            )} 
          </div>
          <p className='text-end'>
              Tổng tiền: <b>{formatNumber(props.data.tongTien)}</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Invoice