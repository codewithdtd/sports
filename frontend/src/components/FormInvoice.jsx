import React from 'react'


const FormInvoice = (props) => {
  const print = () => {
    window.print()
  }
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  return (
    <div className='bg-black bg-opacity-50 w-full h-full absolute flex top-0 left-0' onClick={e => props.toggle(false)}>
        <div className='bg-white m-auto print p-2 rounded-lg text-center' onClick={e => e.stopPropagation()}>
            <h1 className="font-bold text-2xl text-center">HÓA ĐƠN</h1>
            <div className='flex text-start justify-between gap-14'>
                <div>
                    <p className='p-1'>Khách hàng: {props.data.khachHang.ho_KH} {props.data.khachHang.ten_KH}</p>
                    <p className='p-1'>Số điện thoại: {props.data.khachHang.sdt_KH} </p>
                    <p className='p-1'>Email: {props.data.khachHang.email_KH} </p>
                    <p className='p-1'>Thời gian: {props.data.datSan.thoiGianBatDau} - {props.data.datSan.thoiGianKetThuc}</p>
                    <p className='p-1'>Ngày đặt: {props.data.datSan.ngayDat}</p>
                </div>
                <div>
                    <p className='p-1'>Nhân viên: {props.data.nhanVien.ho_NV} {props.data.nhanVien.ten_NV}</p>
                    <p className='p-1'>Phương thức: {props.data.phuongThucThanhToan}</p>
                    <p className='p-1'>Ngày tạo: {props.data.ngayTao_HD}</p>
                    <p className='p-1'>Check-in: {props.data.datSan.thoiGianCheckIn}</p>
                    <p className='p-1'>Check-out: {props.data.datSan.thoiGianCheckOut}</p>
                </div>
            </div>
            <div className='gap-14'>
                <div className='flex justify-around text-center font-bold bg-gray-400'>
                    <p className='p-1 border border-gray-500 w-full'>TÊN</p>
                    <p className='p-1 border border-gray-500 w-full'>SỐ LƯỢNG</p>
                    <p className='p-1 border border-gray-500 w-full'>GIÁ</p>
                </div>
                <div className='flex justify-around text-center'>
                    <p className='p-1 border border-gray-500 w-full'>{props.data.datSan.san.ma_San}</p>
                    <p className='p-1 border border-gray-500 w-full'>1</p>
                    <p className='p-1 border border-gray-500 w-full'>{formatNumber(props.data.datSan.san.bangGiaMoiGio)}</p>
                </div>
                {props.data.datSan.dichVu?.map((item) => 
                <div className='flex justify-around text-center items-center'>
                    <p className='p-1 border border-gray-500 w-full'>{item.ten_DV}</p>
                    <p className='p-1 border border-gray-500 w-full'>{item.soluong}</p>
                    <p className='p-1 border border-gray-500 w-full'>{formatNumber(item.thanhTien)}</p>
                </div>
                )}
                <p className='text-end'>Tổng tiền: <b>{formatNumber(props.data.tongTien)}</b></p>
            </div>
            <button type='button' className='bg-green-600 no-print p-1 px-3 rounded-md text-white' onClick={print}>Xuất hóa đơn</button>
        </div>
    </div>
  )
}

export default FormInvoice