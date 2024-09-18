import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import sportTypeService from '../services/sportType.service'
const Booking = () => {
  const [listLoai, setListLoai] = useState(null)
  const [search, setSearch] = useState('')
  const getLoai = async () => {
    const loai = await sportTypeService.getAll();
    setListLoai(loai)
  }
  useEffect(() => {
    getLoai();
  },[])


  return (
    <>
      <div className='m-4 gap-3 grid lg:grid-cols-4 sm:grid-cols-2'>
        {listLoai?.map((item) => 
          <NavLink key={item._id} to={item.ten_loai}>
            <div className='bg-gradient-to-b from-[#ffa42e] to-orange-700 rounded-xl booking h-[50vh] lg:h-[60vh] relative shadow-lg shadow-gray-500'>
              <img src={`http://localhost:3000/uploads/${item.hinhAnhDaiDien}`} className='absolute object-contain' alt="" />
              <p className='text-5xl font-semibold absolute bottom-3 right-3'>{item.ten_loai}</p>
            </div> 
          </NavLink>
        )}
      </div>
    </>
  )
}

export default Booking