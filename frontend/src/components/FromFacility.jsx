import React, { useState, useEffect } from 'react'
import serviceService from '../services/service.service';
import ConfirmCheckOut from './ConfirmCheckOut';
import { useSelector } from 'react-redux';

function FromFacility(props) {
  const [data, setData] = useState(props.data);
  const [show, setShow] = useState(false);
  const [modalService, setModalService] = useState(false);
  const [listService, setListService] = useState(null)
  const [listServiceSelected, setListServiceSelected] = useState([])
  const [timeStart, setTimeStart] = useState('--:--')
  const [timeEnd, setTimeEnd] = useState('--:--')
  const [paymentModal, setPaymentModal] = useState(false)
  const user = useSelector((state)=> state.user.login.user)
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    // console.log('click')
    if(!data.datSan) {
      console.log('Trống')
      return;
    }
    (data.datSan.thoiGianCheckOut == '--:--' || !data.datSan.thoiGianCheckOut) 
      ? data.phuongThuc = 'edit' 
      : (data.phuongThuc = 'thanhToan');

    // if(data.phuongThuc = 'thanhToan') {

    // }
    props.handleData(data); // Xử lý dữ liệu biểu mẫu
  };

  const getTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const getDate = () => {
    const now = new Date();

    // Lấy ngày, tháng, năm
    const day = String(now.getDate()).padStart(2, '0'); // Thêm 0 nếu số ngày nhỏ hơn 10
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // định dạng số
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
  // Tính giờ
  const calculateTimeDifference = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "";
    }
    // Tạo một ngày mẫu, chỉ quan tâm đến giờ phút
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Tạo các đối tượng Date với ngày hiện tại và thời gian tương ứng
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0); // Giờ, Phút, Giây

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);

    // Tính toán chênh lệch thời gian (milliseconds)
    const diffInMs = endDate - startDate;

    // Chuyển đổi chênh lệch thời gian từ milliseconds sang phút
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60*60)); // Chia 1000 để ra giây, chia 60 để ra phút

    return diffInMinutes;
  };


  // Lấy dữ liệu từ database
  const getService = async () => {
    const services = await serviceService.getAll();
    setListService(services);
  }

  const addSelected = (data) => {
    setListServiceSelected((prevList) => {
      // Kiểm tra xem đối tượng đã tồn tại trong mảng hay chưa
      const existingItem = prevList.find(item => item._id === data._id);

      if (existingItem) {
        // Nếu đối tượng đã tồn tại, tăng số lượng lên 1
        return prevList.map(item => 
          item._id === data._id 
            ? { ...item, soluong: item.soluong + 1 }
            : item
        );
      } else {
        // Nếu đối tượng chưa tồn tại, thêm đối tượng mới với số lượng là 1
        data.soluong = 1;
        return [...prevList, data];
      }
    });
  }
  const removeSelected = (data) =>{
    setListServiceSelected(listServiceSelected.filter(item => item._id !== data._id));
  }

  const saveServiceSelected = () => {
    const thanhTien = calculateTimeDifference(data.datSan.thoiGianBatDau, data.datSan.thoiGianKetThuc)*data.bangGiaMoiGio + listServiceSelected.reduce((a, c) => a + c.thanhTien, 0)
    // console.log(thanhTien);
    setData({...data, datSan: {...data.datSan, dichVu: listServiceSelected, thanhTien: thanhTien}})
    setModalService(!modalService)
  }

  // Mở modal
  const openModalService = () => {
    const serviceFromData = data.datSan?.dichVu;
    if(serviceFromData) {
      setListServiceSelected(serviceFromData);
      setModalService(!modalService);
    }
  }
// Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    setListServiceSelected(prevList => 
      prevList.map(item => 
        item._id === id ? { ...item, soluong: newQuantity } : item
      )
    );
  };

  // Bấm đóng modal dịch vụ


  useEffect(() => {
    setData(props.data);
    setShow(true);
    getService();
  }, [props.data]);

  return (
     <div className='absolute py-4 z-10 bg-opacity-30 bg-black flex top-0 right-0 w-full h-full' onClick={e => props.toggle(false)}>
        <form action="" className={`relative shadow-gray-400 shadow-lg overflow-hidden transition flex flex-col lg:flex-row bg-white p-2 px-6 w-5/6 lg:w-1/2 lg:min-w-fit rounded-md m-auto ${show ? 'scale-100' : 'scale-0'}`} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
          <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
          <div className='flex-1'>
          <h1 className='text-center text-2xl font-bold pt-5 pb-2'>SÂN BD5S1</h1>
            <div className='flex justify-between text-sm border-b border-gray-400 mb-3 italic'>
              <p>Nhân viên: {user?.user.ho_NV +' '+ user?.user.ten_NV }</p>
              <p>{getDate()} {getTime()}</p>
              <p>Chức vụ: {user?.user.chuc_vu}</p>
            </div>
            <div className="flex">
              <div className='flex-1 text-sm sm:text-base'>
                <div className='flex'>
                  <p className='w-2/5'>Khách hàng:</p>
                  <span className=''>{data.datSan ? data.datSan.khachHang.ho_KH+' '+data.datSan.khachHang.ten_KH : ''}</span>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Số điện thoại:</p>
                  <span className=''>{data.datSan?.khachHang.sdt_KH}</span>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Hội viên:</p>
                  <span className=''>VIP ??</span>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Trạng thái:</p>
                  <span className=''>{data.datSan?.trangThaiThanhToan}</span>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Ghi chú:</p>
                  <span className=''>{data.datSan?.ghiChu}</span>
                </div>
              </div>
              <div className='flex-1 text-sm sm:text-base'>
                <div className='flex'>
                  <p className='w-2/5'>Mã sân:</p>
                  <span className=''>{data.ma_San}</span>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Thời gian:</p>
                  <div className='flex flex-col'>
                    <span className=''>{data.datSan ? data.datSan.thoiGianBatDau+' - '+data.datSan.thoiGianKetThuc :''}</span> 
                  </div>
                </div>
                <div className='flex'>
                  <p className='w-2/5'>Ngày đặt:</p>
                  <span className=''>{data.datSan ? data.datSan.ngayTao : ''}</span>
                </div>
                <div className='text-sm sm:text-base'>
                  <div className='flex'>
                    <p className='w-3/5'>Thời gian nhận sân:</p>
                    <span>{data.datSan?.thoiGianCheckIn}</span>
                  </div>
                  <div className='flex'>
                    <p className='w-3/5'>Thời gian trả sân:</p>
                    <span>{data.datSan?.thoiGianCheckOut}</span>
                  </div>
                </div>
              </div>
            </div>



            {/* Bảng dịch vụ */}
            <div className='flex-1 text-end'>
              <div className='flex text-center font-bold bg-gray-400'>
                  <div className="flex-1 border border-gray-300">Tên</div>
                  <div className="flex-1 border border-gray-300">Số lượng</div>
                  <div className="flex-1 border border-gray-300">Giá</div> 
              </div>
              {data.datSan?.dichVu?.map(item =>
              <div key={item._id} className='flex text-center'>
                  <div className="flex-1 border-b border-gray-400">{item.ten_DV}</div>
                  <div className="flex-1 border border-t-0 border-gray-400">{item.soluong}</div>
                  <div className="flex-1 border-b border-gray-400">{formatNumber(item.thanhTien)}</div> 
              </div>
              ) || <div className='text-center border-b border-gray-400'>Trống</div>
              }


              <button type='button'
                className='border-green-600 border flex-1 my-2 rounded-lg 
                text-green-600 p-2 py-1 hover:bg-green-500 hover:text-white'
                onClick={e => openModalService()}
              >+ Thêm
              </button>
              <p className='pb-1'>Tổng tiền: <b>{formatNumber(data.datSan?.thanhTien || 0)}</b></p> 
              {/* <p className='pb-1'>Giảm giá: <b>0</b></p> 
              <p className='pb-1'>Thành tiền: <b>0</b></p>  */}
            </div>
            <div className='flex items-center'>
              Phương thức thanh toán:
              <select required className='border border-gray-500 ml-2 '
                onChange={e => setData({...data, phuongThucThanhToan: e.target.value})}
              >
                <option value="">Chọn</option>
                <option value="Momo">Momo</option>
                <option value="VNPay">VNPay</option>
                <option value="Tiền mặt">Tiền mặt</option>
              </select>
            </div>
            <div className='flex mt-4'>
                <button type='button' className='border-green-600 flex-1 mx-2 border px-3 py-1 rounded-lg font-bold text-green-600 hover:bg-green-500 hover:text-white' 
                  onClick={e => {if(data.datSan) setData({...data, datSan: {...data.datSan, thoiGianCheckIn: getTime()}})}}>
                    Nhận sân
                </button>
                <button type='button' className='border-gray-600 flex-1 mx-2 bg-gray-200 border px-3 py-1 rounded-lg font-bold text-gray-600 hover:bg-gray-500 hover:text-white'
                  onClick={e => {
                    if(data.datSan) {
                      setData({...data, datSan: {...data.datSan, thoiGianCheckOut: getTime()}})
                      setPaymentModal(true)
                    }}}>
                  Trả sân
                </button>
                <button className='bg-green-600 flex-1 py-1 mx-2 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
            </div>
          </div>


          {/* thêm dịch vụ */}
          {modalService ?
          <div className='flex-1 m-2 lg:w-96 border-2 rounded-lg border-gray-400'>
            <h1 className='text-center font-bold'>DỊCH VỤ</h1>
            <div className='m-4 mt-0 text lg:text-base flex-1 flex flex-col'>
              <div className='flex-1'>     
                <input type="text" className='border border-gray-400 mb-2 rounded-md pl-2 w-full' placeholder='Tìm kiếm'/>
                <div className="border border-gray-500 rounded-lg h-32 lg:h-40 px-2 overflow-x-hidden overflow-y-scroll">
                  <div className='flex text-center font-bold border-b border-gray-400 '>
                    <div className="w-1/2">Tên</div>
                    <div className="w-1/3">Giá</div> 
                  </div>
                  
                  {listService ? listService?.map(item => 
                  <div key={item._id} className='flex border-b border-gray-300 items-center text-center hover:bg-gray-200'>
                    <div className="w-1/2">{item.ten_DV}</div>
                    <div className="w-1/3">{formatNumber(item.gia)}</div>
                    <i className="w-1/6 ri-add-circle-fill text-lg text-green-600 cursor-pointer hover:scale-125" onClick={e => addSelected(item)}></i>
                  </div> ) 
                  : '' }


                </div>
              </div>
              <div className='flex-1'>
                Đã chọn:
                <div className="border mt-2 lg:mt-0 border-gray-500 rounded-lg h-32 lg:h-40 overflow-x-hidden overflow-y-scroll px-2">
                  <div className='flex text-center font-bold border-b border-gray-400'>
                    <div className="w-1/3">Tên</div>
                    <div className="w-1/6">Số lượng</div> 
                    <div className="w-1/3">Giá</div> 
                  </div>

                  {listServiceSelected?.map(item => {
                  item.thanhTien = item.soluong*item.gia;
                  return <div key={item._id} className='flex border-b border-gray-300 items-center text-center mt-1 hover:bg-gray-200'>
                    <div className="w-1/3">{item.ten_DV}</div>
                    <div className='w-1/6'>
                      <input type="number" 
                        className='border border-gray-500 w-1/2' 
                        value={item.soluong}
                        min={1}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
                      />

                    </div>
                    <div className="w-1/3">{formatNumber(item.thanhTien)}</div>
                    <i className="w-[40px] ri-close-circle-fill text-lg text-red-600 cursor-pointer hover:scale-125" 
                        onClick={e => removeSelected(item)}></i>
                  </div>})
                  }

                  
                </div>
                
                <div className='flex'>
                  <button type='button' className='border-gray-600 flex-1 mb-0 bg-gray-200 border px-3 m-4 py-1 rounded-lg font-bold text-gray-600 hover:bg-gray-500 hover:text-white' onClick={e => setModalService(!modalService)}>Đóng</button>
                  <button 
                    type='button' 
                    className='bg-green-600 m-4 flex-1 mb-0 py-1 
                                  rounded-lg text-white hover:bg-green-500'
                    onClick={e => saveServiceSelected()}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          : ''}
          
          {/* {paymentModal ? <ConfirmCheckOut setData={setData} toggle={setPaymentModal} /> : ''} */}
        </form>
    </div>
  )
}

export default FromFacility;

const convertToBase64 = (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}