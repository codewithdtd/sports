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
    confirm_matKhau_KH: ''
  });
  const [checkPassword, setCheckPassword] = useState(false)

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(props.name == 'signUp' && user.matKhau_KH !== user.confirm_matKhau_KH) {
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
          ho_KH: '',
          ten_KH: '',
          email_KH: '',
          sdt_KH: '',
          matKhau_KH: '',
          confirm_matKhau_KH: ''
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
      <div className='w-full h-full grid grid-cols-2 from bg-gray-100'>
        <div className='form-left  bg-gradient-to-r from-[#41e04e] to-[#125c14]'>
          <div className="logo flex">
            
            {/* <img className='w-[50px] m-4' src="./src/assets/logo.svg" alt="" /> */}
          </div>
          <div className='img-main'>
            <img className='w-[70%] md:w-[60%]' src="./src/assets/edit.png" alt="" />
            <h1 className='text-5xl m-2 text-white'>D SPORT</h1>
          </div>
        </div>
        <div className='m-4 form-right relative flex flex-col justify-center align-middle'>
          <Link to="/" className='text-lg absolute top-0 right-0 font-medium text-white bg-green-500 border-2 border-white p-2 px-4 rounded-full hover:bg-green-700'>
            <i className="ri-home-4-line"></i>Trang chủ
          </Link>
          <p className={`text-center ${error ? 'text-red-700 bg-red-200' : 'text-green-700 bg-green-200'}`}>{error || success}</p>
          <h1 className='text-center mb-5'>
            {props.name == 'signUp' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            {props.name == 'signUp' ?
              <div className="flex sm:w-full lg:w-[50%]">
                <div className="flex form-items bg-[#b7f6c1] sm:w-full lg:w-[50%] mr-2">
                  <i className="ri-user-3-line"></i>
                  <input className={`bg-[#b7f6c1]`} type="text" name="ho_KH" value={user.ho_KH} onChange={(e)=>setUser({...user, ho_KH: e.target.value})} placeholder='Họ và tên đệm' required/>
                </div>
                <div className='form-items bg-[#b7f6c1] sm:w-[100%] lg:w-[50%]'>  
                  <i className="ri-user-3-line"></i>
                  <input className={`bg-[#b7f6c1]`} type="text" name="ten_KH" value={user.ten_KH} onChange={(e)=>setUser({...user, ten_KH: e.target.value})} placeholder='Tên' required/>
                </div>
              </div> : ''
            }
            <div className='form-items bg-[#b7f6c1] sm:w-[100%] lg:w-[50%]'>
              <i className="ri-phone-line"></i>
              <input className={`bg-[#b7f6c1]`} type="text" name="sdt_KH" value={user.sdt_KH} onChange={(e)=>setUser({...user, sdt_KH: e.target.value})} placeholder='Số điện thoại' required/>
            </div>
            { props.name == 'signUp' ?
              <div className="form-items bg-[#b7f6c1] sm:w-[100%] lg:w-[50%]">
                <i className="ri-mail-line"></i>
                <input className={`bg-[#b7f6c1]`} type="text" name="email_KH" value={user.email_KH} onChange={(e)=>setUser({...user, email_KH: e.target.value})} placeholder='Email (Nếu có)'/>
              </div> : ''
            }
            <div className="form-items bg-[#b7f6c1] sm:w-[100%] lg:w-[50%]">
              <i className="ri-lock-line"></i>
              <input className={`bg-[#b7f6c1]`} type="password" name="matKhau_KH" value={user.matKhau_KH} onChange={(e)=>setUser({...user, matKhau_KH: e.target.value})} placeholder='Mật khẩu' required/>
            </div>

            { props.name == 'signUp' ?
              <div className='sm:w-[100%] lg:w-[50%]'>
                <div className={`form-items ${checkPassword ? 'bg-red-200' : 'bg-[#b7f6c1]'}`}>
                  <i className="ri-lock-line"></i>
                  <input className={`${checkPassword ? 'bg-red-200' : 'bg-[#b7f6c1]'}`} type="password" name="matKhau_KH" value={user.confirm_matKhau_KH} onChange={(e)=>setUser({...user, confirm_matKhau_KH: e.target.value})} placeholder='Xác nhận mật khẩu' required/>
                </div> 
                {checkPassword ? <p className='-mt-4 text-end text-red-700'>Mật khẩu không khớp</p> : ''}
              </div>
              : ''
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