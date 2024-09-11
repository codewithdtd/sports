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
      <div className='h-[88vh] form flex justify-center items-center from bg-gray-400'>
        <div className='m-4 rounded-lg p-4 flex flex-col justify-center align-middle min-w-[350px]'>
          <h1 className='text-center text-green-600 mb-5 text-3xl font-semibold'>
            {props.name == 'signUp' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col items-center px-4'>
            {props.name == 'signUp' ?
              <div className="flex mb-2 w-full">
                <div className="flex form-items sm:w-full lg:w-[50%] mr-2">
                  <i className="mr-2 ri-user-3-line"></i>
                  <input className='p-2 rounded-xl ' type="text" name="ho_KH" value={user.ho_KH} onChange={(e)=>setUser({...user, ho_KH: e.target.value})} placeholder='Họ và tên đệm' required/>
                </div>
                <div className='form-items sm:w-[100%] lg:w-[50%]'>  
                  <i className="mr-2 ri-user-3-line"></i>
                  <input className='p-2 rounded-xl ' type="text" name="ten_KH" value={user.ten_KH} onChange={(e)=>setUser({...user, ten_KH: e.target.value})} placeholder='Tên' required/>
                </div>
              </div> : ''
            }
            <div className='form-items mb-2 flex w-full'>
              <i className="mr-2 ri-phone-line"></i>
              <input className='p-2 rounded-xl flex-1' type="text" name="sdt_KH" value={user.sdt_KH} onChange={(e)=>setUser({...user, sdt_KH: e.target.value})} placeholder='Số điện thoại' required/>
            </div>
            { props.name == 'signUp' ?
              <div className="form-items mb-2 flex w-full">
                <i className="mr-2 ri-mail-line"></i>
                <input className='p-2 rounded-xl flex-1' type="email" name="email_KH" value={user.email_KH} onChange={(e)=>setUser({...user, email_KH: e.target.value})} placeholder='Email (Nếu có)'/>
              </div> : ''
            }
            <div className="form-items mb-2 flex w-full">
              <i className="mr-2 ri-lock-line"></i>
              <input className='p-2 rounded-xl flex-1' type="password" name="matKhau_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} placeholder='Mật khẩu' required/>
            </div>

            { props.name == 'signUp' ?
              <div className="form-items mb-2 flex w-full">
                <i className="mr-2 ri-lock-line"></i>
                <input className='p-2 rounded-xl flex-1' type="password" name="matKhau_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} placeholder='Xác nhận mật khẩu' required/>
              </div> : ''
            }
            <button className='bg-green-500 hover:bg-green-700 text-white  m-auto rounded-full py-1 px-8'>{props.name == 'signUp' ? 'Đăng ký' : 'Đăng nhập'}</button>
            
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