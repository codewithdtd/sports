import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';
import Form from '../components/Form'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleData= async (data) => {
    try {
      const user = {
        "sdt_KH": data.sdt_KH,
        "matKhau_KH": data.matKhau_KH,
      }
      console.log(data);
      const response = await userService.login(data, dispatch, navigate);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Form sendData={handleData} />
    </div>
  )
}

export default Login