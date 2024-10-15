import React from 'react'
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import userService from '../services/user.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SignUp = () => {

  const handleData= async (data) => {
    try {
      const response = await userService.create(data);
      console.log('Thành Công');
      if(response) {
        setError('')
        toast.success('Đăng ký thành công')
        console.log('Thành Công');
        return true;
      }
    } catch (err) {
      console.log(err);
      if(err.response.statusText == 'Conflict')
        toast.error('Thất bại: '+ 'Tài khoản đã tồn tại')
      else 
        toast.error('Đã có lỗi xảy ra!!');
      return false;
    }
  };
  return (
    <div className='flex h-screen items-center'>
      <ToastContainer autoClose='2000' />
      <div className='h-[90vh] w-[90vw] m-auto border border-gray-400 shadow-lg shadow-gray-800'>
        <Form name='signUp' sendData={handleData}/>
      </div>
    </div>
  )
}

export default SignUp