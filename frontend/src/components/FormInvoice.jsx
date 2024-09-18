import React, { useEffect } from 'react'


const FormInvoice = (props) => {
    
  const print = () => {
    window.print()
  }
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  useEffect(() => {
    console.log(props.listData[0]?.khachHang.ho_KH)
  }, [])
  return (
    <div className='bg-black bg-opacity-50 w-full h-full absolute flex top-0 left-0' onClick={e => props.toggle(false)}>
        <div className='bg-white m-auto print p-2 rounded-lg text-center' onClick={e => e.stopPropagation()}>
            <h1 className="font-bold text-2xl text-center">HÓA ĐƠN</h1>
            <div className='flex text-start justify-between gap-14'>
                <div>
                    <p className='p-1'>Khách hàng: {!props.listData[0] ? props.data.khachHang.ho_KH  : props.listData[0]?.khachHang.ho_KH} {!props.listData[0] ? props.data.khachHang.ten_KH  : props.listData[0]?.khachHang.ten_KH}</p>
                    <p className='p-1'>Số điện thoại: {!props.listData[0] ? props.data.khachHang.sdt_KH  : props.listData[0]?.khachHang.sdt_KH} </p>
                    <p className='p-1'>Email: {!props.listData[0] ? props.data.khachHang.email_KH  : props.listData[0]?.khachHang.email_KH} </p>
                    <p className='p-1'>Thời gian: {!props.listData[0] ? props.data.datSan.thoiGianBatDau  : props.listData[0]?.datSan.thoiGianBatDau} - {!props.listData[0] ? props.data.datSan.thoiGianKetThuc  : props.listData[0]?.datSan.thoiGianKetThuc}</p>
                    <p className='p-1'>Ngày đặt: {!props.listData[0] ? props.data.datSan.ngayDat  : props.listData[0]?.datSan.ngayDat}</p>
                </div>
                <div>
                    <p className='p-1'>Nhân viên: {!props.listData[0] ? props.data.nhanVien.ho_NV  : props.listData[0]?.nhanVien.ho_NV} {!props.listData[0] ? props.data.nhanVien.ten_NV  : props.listData[0]?.nhanVien.ten_NV}</p>
                    <p className='p-1'>Phương thức: {!props.listData[0] ? props.data.phuongThucThanhToan  : props.listData[0]?.phuongThucThanhToan}</p>
                    <p className='p-1'>Ngày tạo: {!props.listData[0] ? props.data.ngayTao_HD  : props.listData[0]?.ngayTao_HD}</p>
                    <p className='p-1'>Check-in: {!props.listData[0] ? props.data.datSan.thoiGianCheckIn  : props.listData[0]?.datSan.thoiGianCheckIn}</p>
                    <p className='p-1'>Check-out: {!props.listData[0] ? props.data.datSan.thoiGianCheckOut  : props.listData[0]?.datSan.thoiGianCheckOut}</p>
                </div>
            </div>
            <div className='gap-14'>
                <div className='flex justify-around text-center font-bold bg-gray-400'>
                    <p className='p-1 border border-gray-500 w-full'>TÊN</p>
                    <p className='p-1 border border-gray-500 w-full'>SỐ LƯỢNG</p>
                    <p className='p-1 border border-gray-500 w-full'>GIÁ</p>
                </div>
                {props.listData?.length < 1 ? 
                <div>
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
                </div>
                :
                props.listData?.map(listItem => 
                    <div>
                        <div className='flex justify-around text-center'>
                            <p className='p-1 border border-gray-500 w-full'>{listItem.datSan.san.ma_San}</p>
                            <p className='p-1 border border-gray-500 w-full'>1</p>
                            <p className='p-1 border border-gray-500 w-full'>{formatNumber(listItem.datSan.san.bangGiaMoiGio)}</p>
                        </div>
                        {listItem.datSan.dichVu?.map((item) => 
                        <div className='flex justify-around text-center items-center'>
                            <p className='p-1 border border-gray-500 w-full'>{item.ten_DV}</p>
                            <p className='p-1 border border-gray-500 w-full'>{item.soluong}</p>
                            <p className='p-1 border border-gray-500 w-full'>{formatNumber(item.thanhTien)}</p>
                        </div>
                        )} 
                    </div> 
                )  
                }
                <p className='text-end'>
                    Tổng tiền: <b>{formatNumber(props.data.tongTien || props.listData?.reduce((a, c) => a + c.tongTien, 0))}</b>
                </p>
            </div>
            <button type='button' className='bg-green-600 no-print p-1 px-3 rounded-md text-white' onClick={print}>Xuất hóa đơn</button>
        </div>
    </div>
  )
}

export default FormInvoice