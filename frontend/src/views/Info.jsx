import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Staff from '../services/staff.service';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../components/Header'
const Info = () => {
  const user = useSelector((state)=> state.user.login.user)
  const accessToken = user?.accessToken;
  const [avatar, setAvatar] = useState(null);
  const [info, setInfo] = useState(user.user)
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffService = new Staff(user, dispatch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isValidVietnamesePhoneNumber(info.sdt_NV)) {
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
    const update = await staffService.update(data._id, data, accessToken, dispatch, navigate );
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
    <div>
      <Header name={'Chỉnh sửa thông tin'} />
      <div className='info md:pt-10 px-4 flex justify-center min-h-[87vh] h-fit'>
        <ToastContainer autoClose='2000' />
        <form className='md:w-3/4 w-full border border-gray-400 shadow-lg shadow-gray-500 flex flex-col items-center bg-white rounded-lg p-4 h-fit my-10' onSubmit={e => handleSubmit(e)}>
          <h1 className='text-center text-2xl md:text-3xl text-green-600 font-bold py-3'>THÔNG TIN</h1>
          <div className='lg:w-4/5 w-full md:text-lg'>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/6'>Họ: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.ho_NV} onChange={e => setInfo({...info, ho_NV: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/6'>Tên: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.ten_NV} onChange={e => setInfo({...info, ten_NV: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/6'>Số điện thoại: </label>
              <input required type="text" minLength={10} maxLength={10} 
                className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' 
                value={info.sdt_NV} 
                onChange={e => setInfo({...info, sdt_NV: e.target.value})}
              />
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/6'>Email: </label>
              <input type="email" className='bg-gray-200 m-2 p-2 px-2 rounded-xl flex-1' value={info.email_NV} onChange={e => setInfo({...info, email_NV: e.target.value})}/>
            </div>
            <button type={`${submit ? 'button' : ''}`} className='bg-green-500 w-full p-1 my-4 rounded-xl text-white hover:bg-green-700'>Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Info