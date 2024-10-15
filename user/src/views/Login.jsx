import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../services/user.service';
import Form from '../components/Form'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector((state)=> state.user.login.user)

  const userService = new User(dispatch)
  const handleData= async (data) => {
    try {
      const user = {
        "sdt_NV": data.sdt_NV,
        "matKhau_NV": data.matKhau_NV,
      }
      const response = await userService.login(data, dispatch, navigate);
      if(response) {
        toast.success("Thành công")
        return true;
      }
    } catch (err) {
      console.log(err);
      toast.error("Thất bại")
      return false;
    }
  };
  return (
    <div className='flex h-screen items-center'>
      <ToastContainer autoClose='2000' /> 
      <div className='h-[90vh] w-[90vw] m-auto border border-gray-400 shadow-lg shadow-gray-800'>
        <Form sendData={handleData} />
      </div>
    </div>
  )
}

export default Login