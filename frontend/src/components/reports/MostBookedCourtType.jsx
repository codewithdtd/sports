import React, {useState, useEffect} from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import BookingService from '../../services/booking.service';
import SportTypeService from '../../services/sportType.service';
import { useSelector, useDispatch } from 'react-redux';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
  fontWeight: 700,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      {children != 0 && (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>)
      }
    </>
  );
}
const MostBookedCourtType = () => {
  const sizing = {
    width: 450,
    height: 350,
  };
  const [list, setList] = useState([])
  const [sportType, setSoprtType] = useState([])
  const [weekDays, setWeekDays] = useState([]);
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [typeTime, setTypeTime] = useState('month')
  const [doanhThu, setDoanhThu] = useState([]);
  const [tongTien, setTongTien] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); 
  const [widthChart, setWidthCharts] = useState(700)
  const user = useSelector((state)=> state.user.login.user)

  const dispatch = useDispatch();
  const bookingService = new BookingService(user, dispatch);
  const sportTypeService = new SportTypeService(user, dispatch)

  const formatDate = (day) => {
    return `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;
  }
  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  const formatToYYYYMMDD = (day) => {
    return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
  }

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number); // Tách các phần ngày, tháng, năm và chuyển thành số
    return new Date(year, month - 1, day); // Tạo đối tượng Date (chú ý tháng trong Date bắt đầu từ 0)
  };

  const getToDay = (direction = '', startDate, endDate) => {
    const today = new Date();

    // Cập nhật tuần offset: nếu 'next' thì tăng thêm 1, nếu 'previous' thì giảm đi 1
    if (direction === 'next') {
      setCurrentWeekOffset((prevOffset) => prevOffset + 1);
    } else if (direction === 'previous') {
      setCurrentWeekOffset((prevOffset) => prevOffset - 1);
    }

    const weekOffset = direction === 'next' ? currentWeekOffset + 1 : direction === 'previous' ? currentWeekOffset - 1 : currentWeekOffset;

    if (startDate && endDate && typeTime != 'date') {
      const start = parseDate(startDate);  // Chuyển đổi startDate thành đối tượng Date
      const end = parseDate(endDate);  // Chuyển đổi endDate thành đối tượng Date
      const daysInRange = [];

      // Lặp qua các ngày từ start đến end
      let currentDay = start;
      while (currentDay <= end) {
        daysInRange.push(formatDate(currentDay));  // Định dạng và thêm ngày vào mảng
        currentDay.setDate(currentDay.getDate() + 1);  // Chuyển sang ngày tiếp theo
      }

      setWeekDays(daysInRange);  // Cập nhật mảng weekDays với các ngày trong khoảng
      return;
    }
    if (startDate && typeTime == 'date') {
      const start = parseDate(startDate);  // Chuyển đổi startDate thành đối tượng Date
      const daysInRange = [];
      console.log('chạy')
      // Lặp qua các ngày từ start đến end
      let currentDay = start;
     
      daysInRange.push(formatDate(currentDay));  // Định dạng và thêm ngày vào mảng
      // currentDay.setDate(currentDay.getDate());  // Chuyển sang ngày tiếp theo
 

      setWeekDays(daysInRange); 
      return // Cập nhật mảng weekDays với các ngày trong khoảng
    }

   
    // 1. Lấy ra ngày hôm nay và thứ trong tuần hiện tại
    let currentDay = today.getDay();  // Lấy thứ trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ...)
    let currentMonth = today.getMonth(); // Tháng hiện tại (0 = Tháng 1)
    let currentYear = today.getFullYear(); // Năm hiện tại

    // Nếu là tuần 
    if(typeTime === 'week') {
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((currentDay === 0 ? 7 : currentDay) - 1) + weekOffset * 7); // Cộng thêm offset tuần
      // 2. Tính toán các ngày từ Thứ Hai đến Chủ Nhật trong tuần hiện tại
      // Tính toán từng ngày từ Thứ Hai đến Chủ Nhật
      const daysOfWeek = [];  // Khởi tạo mảng chứa các ngày trong tuần
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i); // Cộng thêm ngày để lấy các ngày từ Thứ Hai đến Chủ Nhật
        daysOfWeek.push(formatDate(day));  // Thêm ngày vào mảng với định dạng dd/mm/yyyy
      }
      setStartDay(daysOfWeek[0])
      setEndDay(daysOfWeek[daysOfWeek.length -1])
      setWeekDays(daysOfWeek); 
    }

    // Nếu là tháng 
    if(typeTime === 'month') {
      console.log(currentMonth + weekOffset)
      currentMonth += weekOffset; // Điều chỉnh tháng theo offset
      // Xử lý nếu tháng vượt quá 12 hoặc dưới 1
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      } else if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }

      // Lấy ngày đầu tiên và cuối cùng của tháng hiện tại
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0); // Ngày cuối cùng của tháng

      // Tạo mảng chứa tất cả các ngày trong tháng
      const daysInMonth = [];
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
          const date = new Date(currentYear, currentMonth, day);
          daysInMonth.push(formatDate(date)); // Định dạng thành dd/mm/yyyy
      }
      setStartDay(daysInMonth[0])
      setEndDay(daysInMonth[daysInMonth.length -1])
      setWeekDays(daysInMonth);
    }
    // Nếu là tháng 
    if(typeTime === 'date') {
      setEndDay(null)
      const daysInMonth = [];
      const adjustedDate = new Date(today);

      adjustedDate.setDate(today.getDate() + weekOffset);
      
      // const date = new Date(currentYear, currentMonth+1, currentDay);
   
      daysInMonth.push(formatDate(adjustedDate)); // Định dạng thành dd/mm/yyyy
      setStartDay(daysInMonth[0])
      setWeekDays(daysInMonth);
    }
    // countBySportTypeAndDay();
    
  }

  const doanhThuTheoNgay = () => {
    let doanhThuMoi = 0;
    for(let day of weekDays) {
      const theoNgay = list.filter((item) => {
        return item.ngayDat == day && item.trangThai == 'Hoàn thành'
      })
      if(theoNgay.length > 0) {
        const tongTien = theoNgay.reduce((total, item) => total + item.thanhTien, 0);
        doanhThuMoi += tongTien;
      } else {
        doanhThuMoi += 0;
      }
    }
    setTongTien(formatNumber(doanhThuMoi));
  }

  const countBySportTypeAndDay = () => {
    let result = [];

    // Duyệt qua từng loại sportType
    for (let type of sportType) {
      let countByDay = 0;
      
      // Duyệt qua từng ngày trong weekDays
      for (let day of weekDays) {
        // Lọc các phần tử có ngày đặt và loại sân trùng khớp
        const filteredList = list.filter((item) => {
          return (
            item.ngayDat === day &&
            item.san.loai_San._id === type._id 
            && item.trangThai == 'Hoàn thành'
          );
        });

        // Đếm số phần tử và đẩy vào mảng countByDay
        countByDay += filteredList.reduce((acc, cur) => acc + cur.thanhTien, 0);
      }

      // Thêm kết quả đếm theo loại sportType vào mảng kết quả
      result.push({
        lable: type.ten_loai, // Hoặc bất kỳ thuộc tính nào cần hiển thị
        value: countByDay,
      });
    }

    // console.log(result);
    const totalValue = result.reduce((total, item) => total + item.value, 0);

    // Chuyển đổi giá trị thành phần trăm
    const pieData = result.filter((item) => item.value > 0).map((item) => ({
      label: item.lable,
      value: totalValue > 0 ? (item.value / totalValue) * 100 : 0, // Tính phần trăm
    }));
    setDoanhThu(pieData) // Kết quả sẽ là mảng chứa số lượng theo loại sân và ngày
    return result;
  };

  const getBooking = async () => {
    const booking = await bookingService.getAll();
    const sportType = await sportTypeService.getAll();
    setSoprtType(sportType);
    setList(booking);
  }

  useEffect(() => {
    // getToDay();  // Tính toán các ngày trong tuần
    getBooking();
    getToDay();
  }, [typeTime]);

  useEffect(() => {
    if (list.length > 0 && weekDays.length > 0) {
      countBySportTypeAndDay();
      doanhThuTheoNgay();  // Chỉ chạy khi cả list và weekDays đều có dữ liệu
    }
  }, [weekDays, list]);

  useEffect(() => {
    const handleWidthChart = () => {
      if (window.innerWidth < 780 && window.innerWidth >= 600) {
        setWidthCharts(600);
      } else if (window.innerWidth < 600) {
        setWidthCharts(500);
      } 
      else {
        setWidthCharts(700);
      }
    }
    // Add event listener for resizing
    window.addEventListener('resize', handleWidthChart);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleWidthChart);
    };
  }, []);

  return (
    <div className='bg-white md:mt-0 mt-4 p-2 h-full border-gray-400 rounded-xl shadow-md shadow-gray-700 m-auto flex flex-col justify-center items-center'>
      <h3 className='text-2xl font-bold text-gray-700'>Tỷ lệ doanh thu</h3>
      <div className='mx-auto text-center px-2 mt-2 items-center justify-between'>
        <div className='flex items-center justify-center pb-2'>
          <p className={`rounded-md font-extrabold text-xl m-2 hover:bg-blue-600 cursor-pointer`} onClick={e => getToDay('previous')}><i className="ri-arrow-left-s-fill"></i></p>
          <div className='flex'>
            <p className={`p-2 px-4 rounded-md border-2 text-gray-500 font-medium  m-auto mx-1 hover:bg-blue-400 hover:text-white cursor-pointer ${typeTime == 'date' ? 'bg-blue-400 text-white border-blue-400' : 'border-gray-400'}`} onClick={e => setTypeTime('date')}>Ngày</p>
            <p className={`p-2 px-4 rounded-md border-2 text-gray-500 font-medium  m-auto mx-1 hover:bg-blue-400 hover:text-white cursor-pointer ${typeTime == 'week' ? 'bg-blue-400 text-white border-blue-400' : 'border-gray-400'}`} onClick={e => setTypeTime('week')}>Tuần</p>
            <p className={`p-2 px-4 rounded-md border-2 text-gray-500 font-medium  m-auto mx-1 hover:bg-blue-400 hover:text-white cursor-pointer ${typeTime == 'month' ? 'bg-blue-400 text-white border-blue-400' : 'border-gray-400'}`} onClick={e => setTypeTime('month')}>Tháng</p>
          </div>
          <p className={`rounded-md font-extrabold text-xl m-2 hover:bg-blue-600 cursor-pointer`} onClick={e => getToDay('next')}><i className="ri-arrow-right-s-fill"></i></p>
        </div>
        {weekDays.length > 1 && endDay ? 'Từ' : '' }
        <input 
          className='border border-gray-400 mx-2 rounded-md' 
          type="date" 
          value={weekDays[0] ? formatToYYYYMMDD(parseDate(startDay)) : ''} 
          onChange={e => {
            const newStartDay = formatDate(new Date(e.target.value));
            setStartDay(newStartDay);
            getToDay('', newStartDay, endDay); // Update weekDays based on new start date and current end date
          }}/>
        {endDay && typeTime != 'date' ? 
        <>
          Đến:
          <input
            className='border border-gray-400 mx-2 rounded-md'
            type="date"
            value={formatToYYYYMMDD(parseDate(endDay))}
            onChange={(e) => {
              const newEndDay = formatDate(new Date(e.target.value));
              setEndDay(newEndDay);
              getToDay('', startDay, newEndDay); // Update weekDays based on startDay and new end date
            }}
          />
        </>
        : ''}
        {/* <p className='pt-2'>{weekDays[0]}{weekDays.length > 1 && weekDays.length > 20 ? ' - ' +(weekDays[weekDays.length - 1]) : ''}</p> */}
      </div>
      <PieChart
        colors={[
          '#5C8ED4', 
          '#5FBF7A', 
          '#FFDD54', 
          '#FF7E4D', 
          '#4ED5D4', 
          '#D68CD8', 
          '#FFB84D', 
          '#A66EDB', 
          '#C576B8', 
          '#FF7F92', 
        ]}
        series={[
          {
            arcLabel: (item) => `${item.value.toFixed(2)}%`,
            data: doanhThu,
            innerRadius: 60,
            outerRadius: 120,
            paddingAngle: 3,
            cornerRadius: 4,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'black',
            fontSize: 17,
          },
        }}
        {...sizing}
      >
        <PieCenterLabel>{tongTien}</PieCenterLabel>
      </PieChart>
    </div>
  )
}

export default MostBookedCourtType

