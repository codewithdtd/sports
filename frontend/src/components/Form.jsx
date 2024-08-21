import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Form = (props) => {
  const [user, setUser] = useState({
    ho_KH: '',
    ten_KH: '',
    email_KH: '',
    sdt_KH: '',
    matKhau_KH: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await userService.create(user);
      await props.sendData(user);
      setSuccess('Registration successful!');
      // Clear the form
      setUser({
        ho_KH: '',
        ten_KH: '',
        email_KH: '',
        sdt_KH: '',
        matKhau_KH: '',
      });
      } catch (err) {
        console.log(err);
        setError('Registration failed. Please try again.');
      }
    };
  return (
    <>
      <div className='h-screen grid grid-cols-2 from bg-gray-100'>
        <div className='form-left h-screen bg-gradient-to-r from-greenPrimary to-greenSeconday rounded-r-3xl'>
          <div className="logo">
            <img className='w-[50px] m-4' src="./src/assets/img/Logo.svg" alt="" />
          </div>
          <div className='img-main'>
            <img className='w-[70%] md:w-[60%]' src="./src/assets/img/login.png" alt="" />
            <h1 className='text-5xl m-2 text-white'>D SPORT</h1>
          </div>
        </div>
        <div className='m-4 form-right flex flex-col justify-center align-middle'>
          <h1 className='text-center mb-5'>
            {props.name == 'signUp' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            {props.name == 'signUp' ?
              <div className="flex sm:w-full lg:w-[50%]">
                <div className="flex form-items sm:w-full lg:w-[50%] mr-2">
                  <i className="ri-user-3-line"></i>
                  <input className='' type="text" name="ho_KH" value={user.ho_KH} onChange={(e)=>setUser({...user, ho_KH: e.target.value})} placeholder='Họ và tên đệm' required/>
                </div>
                <div className='form-items sm:w-[100%] lg:w-[50%]'>  
                  <i className="ri-user-3-line"></i>
                  <input className='' type="text" name="ten_KH" value={user.ten_KH} onChange={(e)=>setUser({...user, ten_KH: e.target.value})} placeholder='Tên' required/>
                </div>
              </div> : ''
            }
            <div className='form-items sm:w-[100%] lg:w-[50%]'>
              <i className="ri-phone-line"></i>
              <input className='' type="text" name="sdt_KH" value={user.sdt_KH} onChange={(e)=>setUser({...user, sdt_KH: e.target.value})} placeholder='Số điện thoại' required/>
            </div>
            { props.name == 'signUp' ?
              <div className="form-items sm:w-[100%] lg:w-[50%]">
                <i className="ri-mail-line"></i>
                <input className='' type="text" name="email_KH" value={user.email_KH} onChange={(e)=>setUser({...user, email_KH: e.target.value})} placeholder='Email (Nếu có)'/>
              </div> : ''
            }
            <div className="form-items sm:w-[100%] lg:w-[50%]">
              <i className="ri-lock-line"></i>
              <input className='' type="text" name="matKhau_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} placeholder='Mật khẩu' required/>
            </div>

            { props.name == 'signUp' ?
              <div className="form-items sm:w-[100%] lg:w-[50%]">
                <i className="ri-lock-line"></i>
                <input className='' type="text" name="matKhau_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} placeholder='Xác nhận mật khẩu' required/>
              </div> : ''
            }
            <button className='bg-green-500 hover:bg-green-700 text-white w-[50%] m-auto'>{props.name == 'signUp' ? 'Đăng ký' : 'Đăng nhập'}</button>
            
            {props.name == 'signUp' 
            ?  <span>Bạn đã có tài khoản? <Link to="/login" className='text-green-700'>Đăng nhập</Link></span>
            : <span>Bạn chưa có tài khoản? <Link to="/signup" className='text-green-700'>Đăng ký</Link></span>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Form;