import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import User from '../services/user.service';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Info = () => {
  const user = useSelector((state)=> state.user.login.user)
  const accessToken = user?.accessToken;
  const [avatar, setAvatar] = useState(null);
  const [info, setInfo] = useState(user.user)
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userService = new User(user, dispatch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isValidVietnamesePhoneNumber(info.sdt_KH)) {
      toast.error('Số điện thoại không hợp lệ !!!')
      return;
    }
    setSubmit(true)
    if(await updateUser(info))
      toast.success('Thành công!')
    else {
      toast.error('Thất bại!!!')
      return;
    }
  }

  const updateUser = async (data) => {
    const update = await userService.update(data._id, data, accessToken, dispatch, navigate );
    return update;
  }

  function isValidVietnamesePhoneNumber(phoneNumber) {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phoneNumber);
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  return (
    <div className='info bg-green-200 md:pt-10 px-4 flex md:flex-row flex-col min-h-[87vh] h-fit'>
      {/* <div className='flex-1 md:pt-16 info-avatar flex flex-col items-center'>
        <div className='flex justify-center'>
          <img src="./src/assets/background.png" alt="" className="border-green-600 border-[5px] object-cover md:max-w-[40%] max-w-[50%] rounded-full aspect-square"/>
        </div>
        <div className='flex items-center'>
          <h3 className='font-medium my-3'>ẢNH ĐẠI DIỆN</h3>
          <label htmlFor="avatar">
            <i className="ri-pencil-line mx-2 bg-green-500 p-1 rounded-lg hover:bg-green-700"></i>
          </label>
        </div>
        
        <input type="file" id='avatar' className='hidden'/>
      </div> */}
      <ToastContainer autoClose='2000' />

      <div className='flex-1 hidden md:pt-16 info-avatar md:flex flex-col items-center'>
        <div className='flex justify-center'>
          <img src="./src/assets/edit.png" alt="" className="bg-green-500 object-cover md:max-w-[60%] rounded-full aspect-square"/>
        </div>
      </div>
      <form className='md:flex-1 shadow-lg shadow-gray-500 flex flex-col items-center bg-white rounded-lg p-4 h-fit my-10' onSubmit={e => handleSubmit(e)}>
        <h1 className='text-center text-2xl md:text-3xl text-green-600 font-bold py-3'>THÔNG TIN</h1>
        <div className='lg:w-4/5 w-full md:text-lg'>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/4 w-1/6'>Họ: </label>
            <input required type="text" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.ho_KH} onChange={e => setInfo({...info, ho_KH: e.target.value})}/>
          </div>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/4 w-1/6'>Tên: </label>
            <input required type="text" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.ten_KH} onChange={e => setInfo({...info, ten_KH: e.target.value})}/>
          </div>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/4 w-1/6'>Số điện thoại: </label>
            <input required type="text" minLength={10} maxLength={10} className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.sdt_KH} onChange={e => setInfo({...info, sdt_KH: e.target.value})}/>
          </div>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/4 w-1/6'>Email: </label>
            <input type="email" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.email_KH} onChange={e => setInfo({...info, email_KH: e.target.value})}/>
          </div>
          <button type={`${submit ? 'button' : ''}`} className='bg-green-500 w-full p-1 my-4 rounded-xl text-white hover:bg-green-700'>Xác nhận</button>
        </div>
      </form>
    </div>
  )
}

export default Info