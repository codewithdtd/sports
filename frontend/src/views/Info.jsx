import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Staff from '../services/staff.service';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../components/Header'
const Info = () => {
  const user = useSelector((state) => state.user.login.user)
  const accessToken = user?.accessToken;
  const [avatar, setAvatar] = useState(null);
  const [avatarPre, setAvatarPre] = useState(null);
  const [info, setInfo] = useState(user?.user)
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffService = new Staff(user, dispatch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidVietnamesePhoneNumber(info?.sdt_NV)) {
      toast.error('Số điện thoại không hợp lệ !!!')
      return;
    }
    setSubmit(true)
    if (await updateUser(info))
      toast.success('Thành công!')
    else {
      toast.error('Thất bại!!!')
      return;
    }
  }

  const updateUser = async (data) => {
    const userUpdate = new FormData();
    userUpdate.append('ho_NV', data.ho_NV);
    userUpdate.append('ten_NV', data.ten_NV);
    userUpdate.append('sdt_NV', data.sdt_NV);
    userUpdate.append('email_NV', data.email_NV);
    if (avatar) {
      userUpdate.append('hinhAnh_NV', avatar)
    }
    const update = await staffService.update(data._id, userUpdate, accessToken, dispatch, navigate);
    return update;
  }
  const handleFileUploadAvatar = async (e) => {
    const { files } = e.target;
    setAvatar(files[0]);
    const avatarPreview = URL.createObjectURL(files[0]);
    setAvatarPre(avatarPreview);
  }


  function isValidVietnamesePhoneNumber(phoneNumber) {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phoneNumber);
  }
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  })
  return (
    <div className='flex h-[95vh] flex-col'>
      <Header name={'Chỉnh sửa thông tin'} />
      <div className='info relative flex gap-4 flex-1 items-center overflow-hidden justify-center w-full border h-full bg-white  shadow-lg shadow-gray-500 rounded-lg '>
        <ToastContainer autoClose='2000' />
        <div className='w-1/3 z-[2] h-[90%] flex flex-col justify-center items-center text-center bg-white border-2 shadow-md shadow-gray-500 rounded-lg '>
          {user?.user?.hinhAnh_NV && !avatarPre ?
            <img src={`http://localhost:3000/uploads/${user?.user?.hinhAnh_NV}`} className="border-[7px] border-white rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
            : <img src={`${avatarPre ? avatarPre : './src/assets/img/user.png'}`} className="border-[7px] border-white rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
          }
          <p className='mt-3 font-bold text-lg'>
            ẢNH ĐẠI DIỆN
            <label htmlFor="avatar" className='hover:bg-gray-300 rounded-full p-2 py-1 cursor-pointer'>
              <i className="ri-image-edit-fill"></i>
            </label>
          </p>
          <input type="file" id='avatar' className='hidden' onChange={handleFileUploadAvatar} />
        </div>
        <form className='flex-1 md:w-1/2 flex flex-col mr-4 rounded-lg p-4 bg-white border-2 shadow-md shadow-gray-500 h-[90%]' onSubmit={e => handleSubmit(e)}>
          <h1 className='text-center text-2xl md:text-3xl text-blue-600 font-bold py-3'>CẬP NHẬT THÔNG TIN CỦA BẠN</h1>
          <div className='w-full md:text-lg'>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Họ: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info?.ho_NV} onChange={e => setInfo({ ...info, ho_NV: e.target.value })} />
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Tên: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info?.ten_NV} onChange={e => setInfo({ ...info, ten_NV: e.target.value })} />
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Số điện thoại: </label>
              <input required type="text" minLength={10} maxLength={10}
                className='bg-gray-200 m-2 p-2 px-2 flex-1'
                value={info?.sdt_NV}
                onChange={e => setInfo({ ...info, sdt_NV: e.target.value })}
              />
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Email: </label>
              <input type="email" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info?.email_NV} onChange={e => setInfo({ ...info, email_NV: e.target.value })} />
            </div>
            <button type={`${submit ? 'button' : ''}`} className='bg-blue-500 w-full p-1 my-4 rounded-xl text-white hover:bg-blue-700'>Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Info