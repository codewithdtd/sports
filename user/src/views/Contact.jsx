import React, { useState } from 'react'
import contactService from '../services/contact.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [contact, setContact] = useState({});
  const [submit, setSubmit] = useState(false);
  const [validatePhone, setValidatePhone] = useState(false);
  const navigate = useNavigate()
  
  function isValidVietnamesePhoneNumber(phoneNumber) {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phoneNumber);
}

  const create = async (e) => {
    e.preventDefault();
    if(!isValidVietnamesePhoneNumber(contact.sdt)) {
      setValidatePhone(true);
      return;
    }
    setValidatePhone(false);
    try {
      setSubmit(true)
      if(await contactService.create(contact)) {
        toast.success('Gửi thành công !!!')
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.log(error)
      toast.error('Gửi thất bại !!!')
    }
  }

  return (
    <div className='flex bg-green-200 h-[88vh]'>
      <ToastContainer autoClose='2000' />
      <div className='flex-1 m-auto hidden sm:block'>
        <img src="./src/assets/phone-call.png" alt="" className='w-1/2 m-auto'/>
      </div>
      <div className="flex-1 m-auto p-3">
        <form action="" className='bg-white m-auto p-4 rounded-xl shadow-lg shadow-gray-600 md:w-2/30' onSubmit={e => create(e)}>
          <h1 className='text-3xl pb-5 font-bold text-green-600'>Liên hệ với chúng tôi</h1> 
          <div className='m-2 my-4 flex items-center'>
            <label htmlFor=""><i className="mr-3 text-green-600 ri-user-fill"></i></label>
            <input required className='text-lg flex-1 rounded-md p-2 bg-gray-300' type="text" placeholder='Họ tên' onChange={e => setContact({...contact, hoTen: e.target.value})} />
          </div>
          <div className='m-2 my-4 flex items-center'>
            <label htmlFor=""><i className="mr-3 text-green-600 ri-phone-fill"></i></label>
            <div className='relative flex-1'>
              <input minLength={10} maxLength={10} required className={`text-lg w-full rounded-md p-2 bg-gray-300 ${validatePhone ? 'bg-red-200' : ''}`} type="text" placeholder='Số diện thoại' onChange={e => setContact({...contact, sdt: e.target.value})}/>
              { validatePhone ? <p className='text-red-600 text-xs absolute -bottom-4'>Số điện thoại không hợp lệ</p> : ''}
            </div>
          </div>
          <div className='m-2 my-4 flex items-center'>
            <label htmlFor=""><i className="mr-3 text-green-600 ri-mail-fill"></i></label>
            <input className='text-lg flex-1 rounded-md p-2 bg-gray-300' type="email" placeholder='Email (nếu có)' onChange={e => setContact({...contact, email: e.target.value})}/>
          </div>
          <div className='m-2 my-4 flex flex-col '>
            <label htmlFor="" className='text-green-600 font-bold'>Nội dung:</label>
            <textarea required name="" id="" rows={4} className='text-lg flex-1 rounded-md p-2 bg-gray-300' placeholder='Nội dung' onChange={e => setContact({...contact, noiDung: e.target.value})}></textarea>
          </div>
          <button disabled={!submit ? false : true} className='bg-green-600 p-1 w-full rounded-xl text-white'>Gửi</button>
        </form>
      </div>
    </div>
  )
}

export default Contact