import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import User from '../services/user.service';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const ChangePass = () => {
  const user = useSelector((state)=> state.user.login.user)
  const accessToken = user?.accessToken;
  const [info, setInfo] = useState(user.user)
  const [validatePass, setValidatePass] = useState(false)
  const [submit, setSubmit] = useState(false)
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userService = new User(user, dispatch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(info.matKhauMoi !== info.xacNhanMatKhauMoi) {
      setValidatePass(true)
      return;
    }
    if(await updateUser(info)) {
      setSubmit(true)
      toast.success('Thành công!')
    }
    else {
      setSubmit(false)
      toast.error('Mật khẩu không đúng')
      setInfo({...info, matKhauCu: '', matKhauMoi: '', xacNhanMatKhauMoi: ''})
      return;
    }
  }

  // const getUser = async () => {
  //   const get = await userService.get(user.user._id);
  //   console.log(user.user._id)
  //   setInfo(get);
  // }

  const updateUser = async (data) => {
    const update = await userService.update(data._id, data, accessToken, dispatch, navigate );
    return update;
  }
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  })
  useEffect(() => {
    // getUser();
  })
  return (
    <div className='flex h-[85vh] py-5 flex-col'>
      <div className='info relative flex flex-1 overflow-hidden justify-center w-[90%] border border-gray-400 shadow-lg shadow-gray-500 bg-white rounded-lg h-[85vh] m-auto'>
        <ToastContainer autoClose='2000' />
        <div className='w-1/3 z-[2] h-full flex flex-col justify-center items-center text-center bg-blue-500'>
          { user.user.hinhAnh_KH ? 
            <img src={`http://localhost:3000/uploads/${user.user.hinhAnh_KH}`} className="border-[7px] border-white rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
            : <img src={`./src/assets/user-profile.png`} className="rounded-full w-1/2 h-fit md:w-[50%] aspect-square object-cover" alt="" />
          }
          <p className='mt-3 font-bold text-lg'>
            {user.user.ho_KH + ' ' + user.user.ten_KH}
          </p>
          <p className='text-lg'>
            Phone: {user.user.sdt_KH}
          </p>
          <p className='text-lg'>
            Email: {user.user.email_KH}
          </p>
          
        </div>
        <form className='flex flex-col flex-1 w-full md:w-1/2 items-center rounded-lg p-4 h-fit my-10' onSubmit={e => handleSubmit(e)}>
          <h1 className='text-center text-3xl text-blue-600 font-bold py-3'>ĐỔI MẬT KHẨU</h1>
          <div className='w-full md:text-lg'>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/3 w-1/4'>Nhập mật khẩu cũ: </label>
              <input required type="password" className='bg-gray-200 m-2 p-3 px-2 rounded-xl flex-1' value={info?.matKhauCu} onChange={e => setInfo({...info, matKhauCu: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/3 w-1/4'>Nhập mật khẩu mới: </label>
              <input required type="password" className='bg-gray-200  m-2 p-3 px-2 rounded-xl flex-1' value={info?.matKhauMoi} onChange={e => setInfo({...info, matKhauMoi: e.target.value})}/>
            </div>
            <div className='flex items-center py-1'>
              <label htmlFor="" className='md:w-1/3 w-1/4'>Xác nhận mật khẩu mới: </label>
              <div className='flex-1 flex flex-col relative'>
                <input required type="password" className={`bg-gray-200  flex-1 m-2 p-3 px-2 rounded-xl  ${validatePass ? 'bg-red-200' : ''}`} value={info?.xacNhanMatKhauMoi} onChange={e => setInfo({...info, xacNhanMatKhauMoi: e.target.value})}/>
                {validatePass ? <p className='absolute text-red-600 -bottom-3 right-4 text-[12px]'>Mật khẩu không chính xác</p> : '' }
              </div>
            </div>
            <button type={`${submit ? 'button' : ''}`} className='bg-blue-500 w-full p-2 my-4 rounded-xl text-white hover:bg-blue-700'>Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePass