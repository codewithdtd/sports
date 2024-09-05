import React from 'react'
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import staffService from '../services/staff.service';
const SignUp = () => {

  const handleData= async (data) => {
    try {
      const response = await staffService.create(data);
      console.log('Thành Công');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Form name='signUp' sendData={handleData}/>
    </div>
  )
}

export default SignUp