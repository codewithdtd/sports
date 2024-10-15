import React from 'react'
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import userService from '../services/user.service';
const SignUp = () => {

  const handleData= async (data) => {
    try {
      const response = await userService.create(data);
      console.log('Thành Công');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='flex h-screen items-center'>
      <div className='h-[90vh] w-[90vw] m-auto border border-gray-400 shadow-lg shadow-gray-800'>
        <Form name='signUp' sendData={handleData}/>
      </div>
    </div>
  )
}

export default SignUp