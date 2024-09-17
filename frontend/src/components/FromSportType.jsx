import React, { useState, useEffect } from 'react'
import sportTypeService from '../services/sportType.service';

function FromSportType(props) {
  const [data, setData] = useState(props.data);
  const [preImg, setPreImg] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [show, setShow] = useState(false);
  const [listDeleteImage, setListDeleteImage] = useState([])

  const [formData, setFormData] = useState({
    hinhAnh: [],
    hinhAnhDaiDien: null,
  });

  const handleFileUpload = async (e) => {
    // const files = e.target.files;
    // const images = [];
    // for (let i = 0; i < files.length; i++) {
    //   const base64 = await convertToBase64(files[i]);
    //   images.push(base64); // Lưu trữ mỗi hình ảnh dưới dạng base64
    // }
    // setPreImg(images);
    const { name, files } = e.target;
    setFormData({...formData, hinhAnh: files});

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreImg(previews);
  }

  const handleFileUploadAvatar = async (e) => {
    // const files = e.target.files;
    // const base64 = await convertToBase64(files[0]);
    // setData({...data, hinhAnhDaiDien: base64});
    const { name, files } = e.target;
    setFormData({...formData, hinhAnhDaiDien: files[0]});
    const avatarPreview = URL.createObjectURL(files[0]);
    setAvatar(avatarPreview);

  }


  const handleSubmit = (e) => {
    e.preventDefault();
    data._id ? (data.phuongThuc = 'edit') : (data.phuongThuc = 'create');
    // if (preImg?.length > 0) {
    //   data.hinhAnh = [...data.hinhAnh, ...preImg]; // Cập nhật với danh sách hình ảnh đã tải lên
    // }
    // console.log(data)

    const uploadData = new FormData();
    uploadData.append('ten_loai', data.ten_loai);
    uploadData.append('_id', data._id);
    uploadData.append('phuongThuc', data.phuongThuc);
    if (formData.hinhAnh) {
      Array.from(formData.hinhAnh).forEach((file) => {
        uploadData.append('hinhAnh', file);
      });
    }

    if (formData.hinhAnhDaiDien) {
      uploadData.append('hinhAnhDaiDien', formData.hinhAnhDaiDien);
    }
    // console.log(uploadData)
    listDeleteImage.forEach((img) => {
      handleDeleteImage(img);
    })
    props.handleData(uploadData);  // Xử lý dữ liệu biểu mẫu
  };

  const handleDeleteImage = async (path) => {
    const payload = { hinhAnh: path }
    const deletePath = await sportTypeService.deleteImage(data._id, payload);
    if(deletePath) {
      console.log("đã xóa hình")
    }
  } 

  useEffect(() => {
    setData(props.data);
    setShow(true)
  }, [props.data]);

  return (
     <div className='absolute bg-opacity-30 bg-black -translate-x-2 flex top-0 w-full h-full' onClick={e => props.toggle(false)}>
        <form action="" className={`relative transition flex flex-col bg-white p-2 px-6 w-3/5 lg:w-5/12 rounded-md m-auto md:-translate-x-20+ ${show ? 'scale-100' : 'scale-0'}`} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <i className="ri-close-line absolute right-0 top-0 text-2xl cursor-pointer" onClick={e => props.toggle(false)}></i>
            <h1 className='text-center text-2xl font-bold p-5'>THÔNG TIN</h1>
            <div className="flex">
              <label htmlFor="" className='w-1/4'>Loại thể thao:</label>
              <input name='ten_loai' className='flex-1 bg-gray-300 mb-2 rounded-xl p-1 pl-2' type="text" value={data.ten_loai} onChange={e => setData({...data, ten_loai: e.target.value})}/>
            </div>
            <div className='flex'>
              <label htmlFor="" className='w-1/4'>Ảnh đại diện:</label>
              <div className='w-3/4 flex flex-col'>
                {data.hinhAnhDaiDien ?
                <div className='relative w-1/2'>
                  <img src={`http://localhost:3000/uploads/${data.hinhAnhDaiDien}`} alt='' className='object-contain mb-2' />
                </div>
                : ''}
                {avatar ?
                <div className='relative w-1/2'>
                  <img src={avatar} alt='' className='object-contain mb-2' />
                </div>
                : ''}
              <label htmlFor="file-upload-avatar" className='bg-gray-300 hover:text-blue-900 hover:border-blue-500 cursor-pointer w-[80px] h-[80px] flex items-center justify-center text-4xl rounded-lg border border-dashed border-black'>
                <i className="ri-image-add-fill"></i>
              </label>
              <input id='file-upload-avatar' className='hidden' type='file' name='hinhAnhDaiDien' onChange={handleFileUploadAvatar} />
              </div>
            </div>
            <div className="flex mt-2">
              <label htmlFor="" className='w-1/4'>Hình ảnh:</label>
              <div className='w-3/4 flex flex-col max-h-64 overflow-y-scroll'>
              {/* Hiển thị các hình ảnh từ props */}
              {data.hinhAnh?.length > 0 && data.hinhAnh?.map((img, index) => (
                <div key={index} className='relative w-1/2'>
                  <img src={`http://localhost:3000/uploads/${img}`} alt='' className='object-contain mb-2' />
                  <i className="ri-close-line bg-red-500 text-white m-auto px-1 font-bold absolute top-0 right-0 cursor-pointer"
                    onClick={e => {
                      const newHinhAnh = [...data.hinhAnh]; // Tạo một bản sao của mảng
                      newHinhAnh.splice(index, 1); // Xóa phần tử tại chỉ số `index`
                      setData({ ...data, hinhAnh: newHinhAnh }); // Cập nhật state với mảng mới
                      setListDeleteImage([...listDeleteImage, img])
                    }}
                  ></i>
                </div>
              ))}
              
              {/* Hiển thị các hình ảnh đã upload */}
              {preImg && preImg.map((img, index) => (
                <img key={index} src={`${img}`} alt='' className='w-1/2 mb-2' />
              ))}

              <label htmlFor="file-upload" className='bg-gray-300 hover:text-blue-900 hover:border-blue-500 cursor-pointer w-[80px] h-[80px] flex items-center justify-center text-4xl rounded-lg border border-dashed border-black'>
                <i className="ri-image-add-fill"></i>
              </label>
              <input id='file-upload' className='hidden' type='file' name='hinhAnh' multiple onChange={handleFileUpload} />
            </div>
            </div>
            <button className='bg-green-600 m-4 py-1 rounded-lg text-white hover:bg-green-500'>Xác nhận</button>
        </form>
    </div>
  )
}

export default FromSportType;



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
