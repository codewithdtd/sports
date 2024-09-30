import React, { useState, useEffect } from 'react'

const Notify = (props) => {

    return (
        <div className='absolute bg-white p-2 z-10 custom-scrollbar overflow-y-scroll top-full right-0 w-44 max-h-48 shadow-md shadow-gray-400'>
            {props.data?.map((booking, index) => 
                <div  key={booking._id} className='border-b py-1 border-gray-300'>
                    <h6 className='text-xs font-bold'>Sân CL01 29/09/2024</h6>
                    <h6 className='text-xs font-bold'>10:00 - 11:00</h6>
                    <p className={`text-sm 
                        ${booking.trangThai == 'Đã duyệt' ? 'text-green-500' : '' } 
                        ${booking.trangThai == 'Đã hủy' ? 'text-red-500' : '' } 
                        font-medium`}
                    >
                        {booking.trangThai} 
                        {booking.trangThai == 'Đã duyệt' ? <i className="ri-check-line"></i> : ''}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Notify