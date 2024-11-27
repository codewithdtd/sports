import React from 'react'

const Invoice = (props) => {
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  return (
    <div className='w-full flex h-full bg-black bg-opacity-70 absolute top-0' onClick={e => props.toggle(false)}>
      <div className='relative bg-white m-auto print p-6 px-8 rounded-lg text-center' onClick={e => e.stopPropagation()}>
        <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
        <div className='flex mt-4 mb-2 border-b border-gray-700'>
          <div className='text-sm text-start pr-8'>
            <div className="flex items-center logo text-4xl font-bold min-w-20 italic text-blue-700">
              <img src="./src/assets/logo.svg" alt="" className=' w-full object-cover' />
            </div>
          </div>
          <div className="flex-1 text-start">
            <h1 className='font-medium text-xl text-start'>SÂN THỂ THAO DSOPRT</h1>
            <p>Địa chỉ: đường 3/2, phường Hưng Lợi, quận Ninh Kiều, thành phố Cần Thơ</p>
            <p>Số điện thoại: 0999 888 777</p>
            <p>Email: dsport@gmail.com</p>
          </div>
        </div>
        <h2 className='font-bold text-2xl'>HÓA ĐƠN THANH TOÁN</h2>
        <p className='text-sm font-medium'>Mã hóa đơn: {props.data._id}</p>
        {/* <div className='flex justify-between mb-10'>
          <div className="logo flex items-center text-4xl font-bold italic text-blue-700">
            <img src="./src/assets/logo.svg" alt="" className='md:w-3/4' />
            <span className='md:block hidden'>DSOPRT</span>
          </div>
          <div>
            <h1 className='text-center font-bold text-5xl text-blue-700'>HÓA ĐƠN</h1>
            <p className='text-sm font-medium'>Mã hóa đơn: {props.data._id}</p>
          </div>
        </div> */}
        <div className='flex text-start justify-between gap-16'>
          <div>
            <p className='p-1'>Khách hàng: {props.data.khachHang.ho_KH} {props.data.khachHang.ten_KH}</p>
            <p className='p-1'>Số điện thoại: {props.data.khachHang.sdt_KH} </p>
            <p className='p-1'>Email: {props.data.khachHang.email_KH} </p>
            <p className='p-1'>Thời gian: {props.data.datSan.thoiGianBatDau} - {props.data.datSan.thoiGianKetThuc}</p>
            <p className='p-1'>Ngày đặt: {props.data.datSan.ngayDat}</p>
          </div>
          <div>
            <p className='p-1'>Nhân viên: {props.data.nhanVien.ho_NV} {props.data.nhanVien.ten_NV}</p>
            <p className='p-1'>Phương thức: {props.data.phuongThucThanhToan} </p>
            <p className='p-1'>Ngày tạo: {props.data.ngayTao_HD} </p>
            <p className='p-1'>Check-in: {props.data.datSan.thoiGianCheckIn}</p>
            <p className='p-1'>Check-out: {props.data.datSan.thoiGianCheckOut}</p>
          </div>
        </div>
        <div className='gap-14 pt-5'>
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
          <p className='text-end'>
            Phụ thu: <b>{formatNumber(props.data.phuThu || 0)}</b>
          </p>
          <p className='text-end'>
            Giảm giá: <b>{formatNumber(props.data.giamGia || 0)}</b>
          </p>
          <p className='text-end'>
            Tiền phải trả: <b>{formatNumber(props.data.tongTien + (props.data.phuThu || 0) - (props.data.giamGia || 0))}</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Invoice