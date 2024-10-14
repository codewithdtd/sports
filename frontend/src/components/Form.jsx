import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Form = (props) => {
  const [user, setUser] = useState({
    ho_NV: '',
    ten_NV: '',
    email_NV: '',
    sdt_NV: '',
    matKhau_NV: '',
    confirm_matKhau_NV: ''
  });
  const [checkPassword, setCheckPassword] = useState(false)

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(props.name == 'signUp' && user.matKhau_NV !== user.confirm_matKhau_NV) {
        setCheckPassword(true);
        return;
      } else {
        setCheckPassword(false);
      }
      if(await props.sendData(user)) {
        setSuccess('Đăng ký thành công!');
        setError('');
        // Clear the form
        setUser({
          ho_NV: '',
          ten_NV: '',
          email_NV: '',
          sdt_NV: '',
          matKhau_NV: '',
          confirm_matKhau_NV: ''
        });
      }
      else {
        console.log(!props.error)
        setSuccess('');
        props.name == 'signUp' ? setError('Đăng ký thất bại! Vui lòng thử lại') : setError('Đăng nhập thất bại! Vui lòng thử lại');
      }
    } catch(err){
      setSuccess('');
      setError('Đăng ký thất bại! Vui lòng thử lại');
    }
  
   
  };
  return (
    <>
      <div className='h-screen grid grid-cols-2 from bg-gray-100'>
        <div className='form-left h-screen bg-gradient-to-r from-sky-400 to-sky-900 rounded-r-3xl'>
          <div className="logo flex">
            <img className='w-[50px] m-4' src="./src/assets/img/Logo.svg" alt="" />
          </div>
          <div className='img-main'>
            <img className='w-[70%] md:w-[60%]' src="./src/assets/img/login.png" alt="" />
            <h1 className='text-5xl m-2 text-white'>D SPORT</h1>
          </div>
        </div>
        <div className='m-4 form-right flex flex-col justify-center align-middle'>
          <p className={`text-center ${error ? 'text-red-700 bg-red-200' : 'text-blue-700 bg-blue-200'}`}>{error || success}</p>
          <h1 className='text-center mb-5'>
            {props.name == 'signUp' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            {props.name == 'signUp' ?
              <div className="flex sm:w-full lg:w-[50%]">
                <div className="flex form-items bg-[#b7d8f6] sm:w-full lg:w-[50%] mr-2">
                  <i className="ri-user-3-line"></i>
                  <input className={`bg-[#b7d8f6]`} type="text" name="ho_NV" value={user.ho_NV} onChange={(e)=>setUser({...user, ho_NV: e.target.value})} placeholder='Họ và tên đệm' required/>
                </div>
                <div className='form-items bg-[#b7d8f6] sm:w-[100%] lg:w-[50%]'>  
                  <i className="ri-user-3-line"></i>
                  <input className={`bg-[#b7d8f6]`} type="text" name="ten_NV" value={user.ten_NV} onChange={(e)=>setUser({...user, ten_NV: e.target.value})} placeholder='Tên' required/>
                </div>
              </div> : ''
            }
            <div className='form-items bg-[#b7d8f6] sm:w-[100%] lg:w-[50%]'>
              <i className="ri-phone-line"></i>
              <input className={`bg-[#b7d8f6]`} type="text" name="sdt_NV" value={user.sdt_NV} onChange={(e)=>setUser({...user, sdt_NV: e.target.value})} placeholder='Số điện thoại' required/>
            </div>
            { props.name == 'signUp' ?
              <div className="form-items bg-[#b7d8f6] sm:w-[100%] lg:w-[50%]">
                <i className="ri-mail-line"></i>
                <input className={`bg-[#b7d8f6]`} type="text" name="email_NV" value={user.email_NV} onChange={(e)=>setUser({...user, email_NV: e.target.value})} placeholder='Email (Nếu có)'/>
              </div> : ''
            }
            <div className="form-items bg-[#b7d8f6] sm:w-[100%] lg:w-[50%]">
              <i className="ri-lock-line"></i>
              <input className={`bg-[#b7d8f6]`} type="password" name="matKhau_NV" value={user.matKhau_NV} onChange={(e)=>setUser({...user, matKhau_NV: e.target.value})} placeholder='Mật khẩu' required/>
            </div>

            { props.name == 'signUp' ?
              <div className='sm:w-[100%] lg:w-[50%]'>
                <div className={`form-items ${checkPassword ? 'bg-red-200' : 'bg-[#b7d8f6]'}`}>
                  <i className="ri-lock-line"></i>
                  <input className={`${checkPassword ? 'bg-red-200' : 'bg-[#b7d8f6]'}`} type="password" name="matKhau_NV" value={user.confirm_matKhau_NV} onChange={(e)=>setUser({...user, confirm_matKhau_NV: e.target.value})} placeholder='Xác nhận mật khẩu' required/>
                </div> 
                {checkPassword ? <p className='-mt-4 text-end text-red-700'>Mật khẩu không khớp</p> : ''}
              </div>
              : ''
            }
            <button className='bg-blue-500 hover:bg-blue-700 text-white w-[50%] m-auto'>{props.name == 'signUp' ? 'Đăng ký' : 'Đăng nhập'}</button>
            
            {props.name == 'signUp' 
            ?  <span>Bạn đã có tài khoản? <Link to="/login" className='text-blue-700'>Đăng nhập</Link></span>
            : <span>Bạn chưa có tài khoản? <Link to="/signup" className='text-blue-700'>Đăng ký</Link></span>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Form;