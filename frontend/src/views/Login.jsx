import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import staffService from '../services/staff.service';
import Form from '../components/Form'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleData= async (data) => {
    try {
      const user = {
        "sdt_NV": data.sdt_NV,
        "matKhau_NV": data.matKhau_NV,
      }
      const response = await staffService.login(data, dispatch, navigate);
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
    <div>
      <Form sendData={handleData} />
      <ToastContainer autoClose='2000' />
    </div>
  )
}

export default Login