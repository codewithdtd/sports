import React, { useState } from 'react'

const FormConfirm = (props) => {
    const [user, setUser] = useState(props.user);
    const [check, setCheck] = useState(false);
    const [note, setNote] = useState('');
    function formatNumber(num) {
        return new Intl.NumberFormat('vi-VN').format(num);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setCheck(true)
        props.submit(user, note)
    }
    const handleOuterClick = (e) => {
        // Chỉ gọi toggle nếu chưa submit
        if (!check) {
            props.toggle(null);
        }
    }
    return (
        <div className='w-screen h-full z-[1] flex absolute top-0 left-0 bg-black bg-opacity-60' onClick={handleOuterClick}>
            <form className='bg-white relative w-5/6 md:w-1/2 h-fit m-auto p-5 rounded-xl' onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={handleOuterClick}></i>
                <h1 className='text-center font-bold text-3xl text-blue-700'>XÁC NHẬN ĐẶT SÂN</h1>
                <div className='m-4'>
                    <div className='flex m-4'>
                        <div className='flex-1 flex items-center'>
                            <label htmlFor=""><i className="ri-user-3-fill mx-2"></i></label>
                            <input type="text" name="" id="" className='border border-gray-400 p-2 flex-1 rounded-lg' value={user.ho_KH} placeholder='Họ' onChange={e => setUser({ ...user, ho_KH: e.target.value })} />
                        </div>
                        <div className='flex-1 flex items-center'>
                            <label htmlFor=""><i className="ri-user-3-fill mx-2"></i></label>
                            <input type="text" name="" id="" className='border border-gray-400 p-2 flex-1 rounded-lg' value={user.ten_KH} placeholder='Tên' onChange={e => setUser({ ...user, ten_KH: e.target.value })} />
                        </div>
                    </div>
                    <div className='flex m-4'>
                        <div className='flex-1 flex items-center'>
                            <label htmlFor=""><i className="ri-phone-fill mx-2"></i></label>
                            <input type="text" name="" id="" className='border border-gray-400 p-2 flex-1 rounded-lg' value={user.sdt_KH} placeholder='Số điện thoại' onChange={e => setUser({ ...user, sdt_KH: e.target.value })} />
                        </div>
                        <div className='flex-1 flex items-center'>
                            <label htmlFor=""><i className="ri-mail-line mx-2"></i></label>
                            <input type="email" name="" id="" className='border border-gray-400 p-2 flex-1 rounded-lg' value={user.email_KH} placeholder='Email' onChange={e => setUser({ ...user, email_KH: e.target.value })} />
                        </div>
                    </div>
                    <div className='flex m-4 items-center'>
                        <label htmlFor="">Ghi chú</label>
                        <input type="text" name="" id="" className='border ml-2 border-gray-400 p-2 flex-1 rounded-lg' value={note} placeholder='Ghi chú' onChange={e => setNote(e.target.value)} />
                    </div>

                    <div className='flex flex-col justify-around'>
                        <div className='flex py-2 bg-blue-400 rounded-lg font-bold justify-around items-center border-b border-gray-400'>
                            <p>Ngày đặt</p>
                            <p>Thời gian</p>
                            <p>Tên sân</p>
                            <p>Thành tiền</p>
                        </div>
                    </div>
                    <div className="flex-1 custom-scrollbar overflow-y-scroll min-h-60 max-h-80">
                        {props.data?.map((bk, index) =>
                            <div key={index} className={`${index % 2 != 0 ? 'bg-blue-200' : 'bg-gray-100'} flex flex-col justify-around rounded-lg`}>
                                <div className='flex py-2 justify-around items-center  border-gray-400'>
                                    <p>{bk.ngayDat}</p>
                                    <p>{bk.thoiGianBatDau} - {bk.thoiGianKetThuc}</p>
                                    <p>{bk.san.ten_San}</p>
                                    <p>{formatNumber(bk.thanhTien || 0)}</p>

                                </div>
                                {bk.dichVu?.map((dichVu, index) =>
                                    <div key={dichVu._id} className='ml-7 flex items-center text-center justify-between p-2 border-gray-400'>
                                        <i className="ri-circle-fill text-[9px]"></i><p className='flex-1'>{dichVu.ten_DV}</p>
                                        <p className='flex-1'>x {dichVu.soluong}</p>
                                        <p className='flex-1'>{formatNumber(dichVu.thanhTien)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row px-5 gap-5'>
                    <button disabled={check} className='border-blue-500 border-2 text-blue-500 m-auto w-full rounded-full font-medium p-2 hover:bg-blue-700 hover:text-white'>Thanh toán khi nhận sân</button>
                    <button disabled={check} className='bg-blue-500 m-auto w-full rounded-full p-2 text-white hover:bg-blue-700' onClick={e => props.thanhToan('Đã thanh toán')}>Thanh toán trực tuyến</button>
                </div>
            </form>
        </div>
    )
}

export default FormConfirm