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
        <div className='relative bg-white h-[90%] m-auto print p-4 px-6 rounded-lg text-center' onClick={e => e.stopPropagation()}>
            <i className="ri-close-line no-print absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <div className='flex justify-between my-4 mb-14'>
                <div className='text-sm text-start'>
                    <p className='italic font-extrabold text-xl'>D SPORT</p>
                        {props.listData[0] ? props.listData.map((item) => (
                            <p>#{item._id}</p>
                        )) :  
                        <p>#{props.data?._id}</p>}
                </div>
                <h1 className="font-bold text-5xl text-center">HÓA ĐƠN</h1>
            </div>
            <div className='flex text-start text-xl justify-between gap-14'>
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
            <div className='gap-14 pt-10 text-lg'>
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
                <p className='text-end py-3'>
                    Tổng tiền: <b>{formatNumber(props.listData.length == 0 ? props.data.tongTien : props.listData?.reduce((a, c) => a + c.tongTien, 0))}</b>
                </p>
            </div>
            <button type='button' className='bg-blue-600 no-print p-1 px-3 float-end rounded-md text-white' onClick={print}>Xuất hóa đơn</button>
        </div>
    </div>
  )
}

export default FormInvoice