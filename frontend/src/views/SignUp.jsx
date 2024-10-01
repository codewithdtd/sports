import React from 'react'
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import StaffService from '../services/staff.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const staffService = new StaffService(dispatch);

  const handleData= async (data) => {
    try {
      const response = await staffService.create(data);
      if(response) {
        setError('')
        toast.success('Đăng ký thành công')
        console.log('Thành Công');
        return true;
      }
    } catch (err) {
      console.log(err);
      setError(err)
      if(err.response.statusText == 'Conflict')
        toast.error('Thất bại: '+ 'Tài khoản đã tồn tại')
      else 
        toast.error('Đã có lỗi xảy ra!!');
      return false;
    }
  };
  return (
    <div>
      <Form name='signUp' sendData={handleData} error={error}/>
      <ToastContainer autoClose='2000' />
    </div>
  )
}

export default SignUp