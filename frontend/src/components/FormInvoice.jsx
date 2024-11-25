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
            <div className='relative bg-white h-[90%] m-auto print p-4 px-6 rounded-lg text-center overflow-auto' onClick={e => e.stopPropagation()}>
                <i className="ri-close-line no-print absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
                <div className='flex mt-4 mb-2 border-b border-gray-700'>
                    <div className='text-sm text-start pr-8'>
                        <div className="flex items-center text-4xl font-bold italic text-blue-700">
                            <img src="src/assets/img/Logo.svg" alt="" className='w-20' style={{ filter: "brightness(0)" }} />
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
                {props.listData[0] ? props.listData.map((item) => (
                    <p>#{item._id}</p>
                )) :
                    <p>#{props.data?._id}</p>}
                <p className=''>Ngày tạo hóa đơn: {!props.listData[0] ? props.data.ngayTao_HD : props.listData[0]?.ngayTao_HD}</p>
                <div className='text-start'>
                    <div>
                        <p className=''>Khách hàng: {!props.listData[0] ? props.data.khachHang.ho_KH : props.listData[0]?.khachHang.ho_KH} {!props.listData[0] ? props.data.khachHang.ten_KH : props.listData[0]?.khachHang.ten_KH}</p>
                        <div className='flex'>
                            <p className='flex-1'>Số điện thoại: {!props.listData[0] ? props.data.khachHang.sdt_KH : props.listData[0]?.khachHang.sdt_KH} </p>
                            <p className='flex-1'>Email: {!props.listData[0] ? props.data.khachHang.email_KH : props.listData[0]?.khachHang.email_KH} </p>
                        </div>
                        <div className='flex'>
                            {/* <p className='flex-1'>Thời gian: {!props.listData[0] ? props.data.datSan.thoiGianBatDau  : props.listData[0]?.datSan.thoiGianBatDau} - {!props.listData[0] ? props.data.datSan.thoiGianKetThuc  : props.listData[0]?.datSan.thoiGianKetThuc}</p> */}
                            <p className='flex-1'>Ngày đặt: {!props.listData[0] ? props.data.datSan.ngayDat : props.listData[0]?.datSan.ngayDat}</p>
                        </div>
                        <p className=''>Nhân viên: {!props.listData[0] ? props.data.nhanVien.ho_NV : props.listData[0]?.nhanVien.ho_NV} {!props.listData[0] ? props.data.nhanVien.ten_NV : props.listData[0]?.nhanVien.ten_NV}</p>
                        <p className=''>Phương thức thanh toán: {!props.listData[0] ? props.data.phuongThucThanhToan : props.listData[0]?.phuongThucThanhToan}</p>
                        <div className='flex'>
                            <p className='flex-1'>Check-in: {!props.listData[0] ? props.data.datSan.thoiGianCheckIn : props.listData[0]?.datSan.thoiGianCheckIn}</p>
                            <p className='flex-1'>Check-out: {!props.listData[0] ? props.data.datSan.thoiGianCheckOut : props.listData[0]?.datSan.thoiGianCheckOut}</p>
                        </div>
                    </div>
                    {/* <div>
                    
                </div> */}
                </div>
                <div className='gap-14 pt-5'>
                    <div className='flex justify-around text-center font-bold bg-gray-400'>
                        <p className='p-1 border border-gray-500 w-full'>TÊN</p>
                        <p className='p-1 border border-gray-500 w-full'>SỐ LƯỢNG</p>
                        <p className='p-1 border border-gray-500 w-full'>GIÁ</p>
                    </div>
                    {props.listData?.length < 1 ?
                        <div>
                            <div className='flex justify-around text-center'>
                                <p className='p-1 border border-gray-500 w-full'>{props.data.datSan.san.ma_San}</p>
                                <p className='p-1 border border-gray-500 w-full'>{props.data.datSan.thoiGianBatDau} - {props.data.datSan.thoiGianKetThuc}</p>
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
                                    <p className='p-1 border border-gray-500 w-full'>{listItem.datSan.thoiGianBatDau + ' - ' + listItem.datSan.thoiGianKetThuc}</p>
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
                    {/* <p className='text-end pt-3'>
                    Thành tiền: <b>{formatNumber(props.listData.length == 0 ? props.data.tongTien : props.listData?.reduce((a, c) => a + c.tongTien, 0))}</b>
                </p>
                <p className='text-end'>
                      Phụ thu: <b>{formatNumber((props.listData.length == 0 ? props.data.phuThu : props.listData?.reduce((a, c) => a + c.phuThu, 0)) || 0) }</b>
                </p> */}
                    <p className='text-end'>
                        Phụ thu: <b>{formatNumber(props.listData.length == 0 ? (props.data.phuThu || 0) : props.listData?.reduce((a, c) => a + (c.phuThu || 0), 0))}</b>
                    </p>
                    <p className='text-end'>
                        Tổng tiền: <b>{formatNumber(props.listData.length == 0 ? props.data.tongTien : props.listData?.reduce((a, c) => a + c.tongTien, 0))}</b>
                    </p>
                    <p className='text-end'>
                        Tổng tiền thanh toán: <b>{formatNumber(props.listData.length == 0 ? (props.data.phuThu || 0) + props.data.tongTien : props.listData?.reduce((a, c) => a + (c.phuThu || 0), 0) + props.listData?.reduce((a, c) => a + c.tongTien, 0))}</b>
                    </p>
                    <p className='text-center italic mt-5'>Cảm ơn quý khách đã sử dụng dịch vụ của DSport</p>
                    <p className='text-center italic'>Nếu có bất kỳ thắc mắc nào xin liên hệ hotline: 0999 888 777</p>
                </div>
                <button type='button' className='bg-blue-600 no-print p-1 px-3 float-end rounded-md text-white' onClick={print}>Xuất hóa đơn</button>
            </div>
        </div>
    )
}

export default FormInvoice