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
  const [avatarPre, setAvatarPre] = useState(null);
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
    const userUpdate = new FormData();
    userUpdate.append('ho_KH', data.ho_KH);
    userUpdate.append('ten_KH', data.ten_KH);
    userUpdate.append('sdt_KH', data.sdt_KH);
    userUpdate.append('email_KH', data.email_KH);
    if(avatar) {
      userUpdate.append('hinhAnh_KH', avatar)
    }
    const update = await userService.update(data._id, userUpdate, accessToken, dispatch, navigate );
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
    if(!user) {
      navigate('/login');
    }
  })
  return (
    <div className='flex h-[85vh] py-5 flex-col bg-gray-200'>
      <div className='info relative flex flex-1 items-center overflow-hidden justify-center w-[90%] rounded-lg h-[90%] m-auto'>
        <ToastContainer autoClose='2000' />
        <div className='w-1/3 flex flex-col justify-center items-center text-center border shadow-gray-500 bg-white m-3 rounded-lg h-[90%] shadow-lg'>
          { user.user.hinhAnh_KH && !avatarPre ? 
            <img src={`http://localhost:3000/uploads/${user.user.hinhAnh_KH}`} className="border-[7px] border-gray-400 rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
            : <img src={`${avatarPre ? avatarPre : './src/assets/avatar.jpg'}`} className="rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
          }
          <p className='mt-3 font-medium text-lg'>
            ẢNH ĐẠI DIỆN
            <label htmlFor="avatar" className='hover:bg-gray-300 hover:text-gray-700 rounded-full p-2 py-1 cursor-pointer'>
              <i className="ri-image-edit-fill"></i>
            </label>
          </p>
          <input type="file" id='avatar' accept="image/*" className='hidden' onChange={handleFileUploadAvatar}/>
        </div>
        <form className='flex-1 md:w-1/2 flex flex-col rounded-lg p-4 border h-[90%] mr-3 bg-white shadow-gray-500 shadow-lg' onSubmit={e => handleSubmit(e)}>
          <h1 className='text-center text-2xl md:text-3xl text-blue-600 font-bold py-3'>CẬP NHẬT THÔNG TIN CỦA BẠN</h1>
          <div className='w-full md:text-lg'>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Họ: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info.ho_KH} onChange={e => setInfo({...info, ho_KH: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Tên: </label>
              <input required type="text" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info.ten_KH} onChange={e => setInfo({...info, ten_KH: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Số điện thoại: </label>
              <input required type="text" minLength={10} maxLength={10} 
                className='bg-gray-200 m-2 p-2 px-2 flex-1' 
                value={info.sdt_KH} 
                onChange={e => setInfo({...info, sdt_KH: e.target.value})}
              />
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/4 w-1/5 font-bold text-gray-800'>Email: </label>
              <input type="email" className='bg-gray-200 m-2 p-2 px-2 flex-1' value={info.email_KH} onChange={e => setInfo({...info, email_KH: e.target.value})}/>
            </div>
            <button type={`${submit ? 'button' : ''}`} className='bg-blue-500 w-full p-1 my-4 rounded-xl text-white hover:bg-blue-700'>Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Info