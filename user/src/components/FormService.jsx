import React, { useEffect, useState } from 'react'
import ServiceService from '../services/service.service'
import { useDispatch, useSelector } from 'react-redux'

const FormService = ({ toggle, service, handle, allService, setService }) => {
  const [listService, setListService] = useState(allService)
  const [listServiceSelected, setListServiceSelected] = useState([])
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.login.user);

  const serviceService = new ServiceService(user, dispatch)
  
  // định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  const getService = async () => {
    const services = await serviceService.getAll();
    setListService(services)
    console.log(service)
    // setListServiceSelected(service.dichVu)
  }

  const addSelected = (data) => {
    
    setService((prevList = []) => 
      prevList.map(item => 
        item._id === data._id 
          ? { ...item, tonKho: item.tonKho - 1 }
          : item
      )
    );
    setListService((prevList = []) => 
      prevList.map(item => 
        item._id === data._id 
          ? { ...item, tonKho: item.tonKho - 1 }
          : item
      )
    );
    
    setListServiceSelected((prevList = []) => {
      // Kiểm tra xem đối tượng đã tồn tại trong mảng hay chưa
      const existingItem = prevList.find(item => item._id === data._id);

      if (existingItem) {
        // Nếu đối tượng đã tồn tại, tăng số lượng lên 1
        return prevList.map(item => 
          item._id === data._id 
            ? { ...item, soluong: item.soluong + 1, thanhTien: item.thanhTien + data.gia }
            : item
        );
      } else {
        // Nếu đối tượng chưa tồn tại, thêm đối tượng mới với số lượng là 1
        data.soluong = 1;
        data.thanhTien = data.gia
        return [...prevList, data];
      }
    });
  }
  const removeSelected = (data) =>{
    setService((prevList = []) => 
      prevList.map(item => 
        item._id === data._id 
          ? { ...item, tonKho: item.tonKho + data.soluong }
          : item
      )
    );
    setListService((prevList = []) => 
      prevList.map(item => 
        item._id === data._id 
          ? { ...item, tonKho: item.tonKho + data.soluong }
          : item
      )
    );
    setListServiceSelected(listServiceSelected.filter(item => item._id !== data._id));
  }

  const handleQuantityChange = (id, newQuantity) => {
    const existingItem = listService.find(item => item._id === id);
    const existingItemSelected = listServiceSelected.find(item => item._id === id);
    const changeQuantity = newQuantity - existingItemSelected.soluong;
    if(existingItem.tonKho - changeQuantity >= 0 ) {
      setService((prevList = []) => 
        prevList.map(item => 
          item._id === id 
            ? { ...item, tonKho: item.tonKho - changeQuantity }
            : item
        )
      );
      setListService((prevList = []) => 
        prevList.map(item => 
          item._id === id 
            ? { ...item, tonKho: item.tonKho - changeQuantity }
            : item
        )
      );
      setListServiceSelected(prevList => 
        prevList.map(item => 
          item._id === id ? { ...item, soluong: newQuantity, thanhTien: item.gia*newQuantity } : item
        )
      );

    }
  };
  

  const handleSubmit = () => {
    service.dichVu = listServiceSelected;
    toggle(false)
    // handle(service);
  }

  useEffect(()=> {
    // getService();
    setListServiceSelected(service.dichVu)
  }, [])
  return (
    <div className='bg-black flex bg-opacity-40 fixed w-full h-full bottom-0 top-0 left-0 z-[1]' onClick={e => toggle(null)}>
        <div className='bg-white mt-24 mb-10 mx-auto shadow-lg md:m-auto p-3 rounded-lg w-3/4 md:w-3/5' onClick={e => e.stopPropagation()}>
            <h1 className='text-center font-bold pb-2 text-2xl'>DỊCH VỤ</h1>
            <div className='md:flex gap-2'>
              <div className='p-2 flex-1 h-60 overflow-y-scroll border border-gray-400 rounded-lg'>
                <div className='flex font-bold justify-between text-center border-b border-gray-400'>
                  <p className='flex-1'>TÊN</p>
                  <p className='flex-1'>GIÁ</p>
                  <p className='flex-1'>SỐ LƯỢNG</p>
                  <p className='mx-3'></p>
                </div>
                {listService?.map((item, index) => 
                  <div key={index} className={`flex hover:bg-gray-200 items-center p-2 justify-between text-center border-b border-gray-400`}>
                    <p className='flex-1'>{item.ten_DV}</p>
                    <p className='flex-1'>{formatNumber(item.gia)}</p>
                    <p className='flex-1'>{item.tonKho}</p>
                    { item.tonKho > 0  ?
                    <i className="ri-add-circle-fill text-blue-600 text-lg cursor-pointer hover:scale-125" onClick={e => addSelected(item)}></i>
                    : <i className="ri-add-circle-fill text-gray-600 text-lg cursor-not-allowed"></i>
                    }
                  </div>
                )}
              </div>
              <div className='p-2 flex-1 h-60 overflow-y-scroll border border-gray-400 rounded-lg'>
                <div className='flex font-bold justify-between text-center border-b border-gray-400'>
                  <p className='flex-1'>TÊN</p>
                  <p className='flex-1'>SỐ LƯỢNG</p>
                  <p className='flex-1'>GIÁ</p>
                  <p className='mx-3'></p>
                </div>
                {listServiceSelected?.map((item, index) => 
                  <div key={index} className='flex hover:bg-gray-200 items-center p-2 justify-between text-center border-b border-gray-400'>
                    <p className='flex-1'>{item.ten_DV}</p>
                    <div className='flex-1'>
                      <input type="number" 
                        value={item.soluong} 
                        className='w-9 border border-gray-300' 
                        min={1}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
                      />
                    </div>
                    <p className='flex-1'>{formatNumber(item.thanhTien)}</p>
                    <i className="ri-close-circle-fill text-red-600 text-lg cursor-pointer hover:scale-125" onClick={e => removeSelected(item)}></i>
                  </div>
                )}
              </div>
            </div>
            <div className='flex pb-3'>
              <button type='button' className='border-gray-600 flex-1 mb-0 bg-gray-200 border px-3 m-4 py-1 rounded-lg font-bold text-gray-600 hover:bg-gray-500 hover:text-white' onClick={e => toggle(false)}>Đóng</button>
              <button 
              type='button' 
              className='bg-blue-600 m-4 flex-1 mb-0 py-1 
                              rounded-lg text-white hover:bg-blue-500'
              onClick={e => handleSubmit()}
              >
              Lưu
              </button>
            </div>
        </div>
    </div>
  )
}

export default FormService