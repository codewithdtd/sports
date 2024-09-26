import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true)
    if(info.matKhauMoi !== info.xacNhanMatKhauMoi) {
      setValidatePass(true)
      return;
    }
    if(await updateUser(info))
      toast.success('Thành công!')
    else {
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
    <div className='info bg-gray-300 md:pt-10 px-4 flex md:flex-row flex-col min-h-[87vh] h-fit'>
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
      <form className='md:flex-1 flex flex-col items-center bg-white rounded-lg p-4 h-fit my-10' onSubmit={e => handleSubmit(e)}>
        <h1 className='text-center text-2xl text-green-600 font-bold py-3'>ĐỔI MẬT KHẨU</h1>
        <div className='lg:w-4/5 w-full'>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/3 w-1/4'>Nhập mật khẩu cũ: </label>
            <input required type="password" className='bg-gray-200 m-2 p-1 px-2 rounded-xl flex-1' value={info?.matKhauCu} onChange={e => setInfo({...info, matKhauCu: e.target.value})}/>
          </div>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/3 w-1/4'>Nhập mật khẩu mới: </label>
            <input required type="password" className='bg-gray-200 m-2 p-1 px-2 rounded-xl flex-1' value={info?.matKhauMoi} onChange={e => setInfo({...info, matKhauMoi: e.target.value})}/>
          </div>
          <div className='flex items-center py-1'>
            <label htmlFor="" className='md:w-1/3 w-1/4'>Xác nhận mật khẩu mới: </label>
            <div className='flex-1 flex flex-col relative'>
              <input required type="password" className={`bg-gray-200 flex-1 m-2 p-1 px-2 rounded-xl  ${validatePass ? 'bg-red-200' : ''}`} value={info?.xacNhanMatKhauMoi} onChange={e => setInfo({...info, xacNhanMatKhauMoi: e.target.value})}/>
              {validatePass ? <p className='absolute text-red-600 -bottom-3 right-4 text-[12px]'>Mật khẩu không chính xác</p> : '' }
            </div>
          </div>
          <button type={`${submit ? 'button' : ''}`} className='bg-green-500 w-full p-1 my-4 rounded-xl text-white hover:bg-green-700'>Xác nhận</button>
        </div>
      </form>
    </div>
  )
}

export default ChangePass