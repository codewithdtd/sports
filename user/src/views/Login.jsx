import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../services/user.service';
import Form from '../components/Form'
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