import React, { useState, useEffect } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import BookingService from '../../services/booking.service';
import InvoiceService from '../../services/invoice.service';
import SportTypeService from '../../services/sportType.service';
import { useSelector, useDispatch } from 'react-redux';
const RevenueChart = () => {
  const [list, setList] = useState([])
  const [sportType, setSoprtType] = useState([])
  const [weekDays, setWeekDays] = useState([]);
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [typeTime, setTypeTime] = useState('month')
  const [doanhThu, setDoanhThu] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [widthChart, setWidthCharts] = useState(700)
  const user = useSelector((state) => state.user.login.user)

  const dispatch = useDispatch();
  const sportTypeService = new SportTypeService(user, dispatch);
  const bookingService = new BookingService(user, dispatch);
  const invoiceService = new InvoiceService(user, dispatch);

  const formatDate = (day) => {
    return `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;
  }
  const formatToYYYYMMDD = (day) => {
    return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
  }

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number); // Tách các phần ngày, tháng, năm và chuyển thành số
    return new Date(year, month - 1, day); // Tạo đối tượng Date (chú ý tháng trong Date bắt đầu từ 0)
  };
  const convertToMMDDYYYY = (dateString) => {
    if (dateString) {
      const [day, month, year] = dateString.split('/'); // Tách các phần của ngày
      return `${year}-${month}-${day}`; // Sắp xếp lại theo định dạng mm-dd-yyyy
    }
  };

  const getToDay = (direction = '', startDate, endDate) => {
    const today = new Date();
    // 1. Lấy ra ngày hôm nay và thứ trong tuần hiện tại
    const currentDay = today.getDay();  // Lấy thứ trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ...)
    let currentMonth = today.getMonth(); // Tháng hiện tại (0 = Tháng 1)
    let currentYear = today.getFullYear(); // Năm hiện tại

    // Cập nhật tuần offset: nếu 'next' thì tăng thêm 1, nếu 'previous' thì giảm đi 1
    if (direction === 'next') {
      setCurrentWeekOffset((prevOffset) => prevOffset + 1);
    } else if (direction === 'previous') {
      setCurrentWeekOffset((prevOffset) => prevOffset - 1);
    }

    const weekOffset = direction === 'next' ? currentWeekOffset + 1 : direction === 'previous' ? currentWeekOffset - 1 : currentWeekOffset;

    if (startDate && endDate) {
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


    // Nếu là tuần 
    if (typeTime === 'week') {
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
      setEndDay(daysOfWeek[daysOfWeek.length - 1])
      setWeekDays(daysOfWeek);
    }

    // Nếu là tháng 
    if (typeTime === 'month') {
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
      setEndDay(daysInMonth[daysInMonth.length - 1])
      setWeekDays(daysInMonth);
    }


  }

  const doanhThuTheoNgay = () => {
    let doanhThuMoi = [];
    for (let day of weekDays) {
      const theoNgay = list.filter((item) => {
        return item.datSan.ngayDat == day && item.datSan.trangThai == 'Hoàn thành'
      })
      if (theoNgay.length > 0) {
        const tongTien = theoNgay.reduce((total, item) => total + item.tongTien + (item.phuThu || 0) - (item.gimaGia || 0), 0);
        doanhThuMoi.push(tongTien);
      } else {
        doanhThuMoi.push(0);
      }
    }
    setDoanhThu(doanhThuMoi);
  }


  const getBooking = async () => {
    const booking = await invoiceService.getAll();
    setList(booking);
    const sportType = await sportTypeService.getAll();
    setSoprtType(sportType);
  }

  useEffect(() => {
    // getToDay();  // Tính toán các ngày trong tuần
    getBooking();
    getToDay();
  }, [typeTime]);

  useEffect(() => {
    if (list.length > 0 && weekDays.length > 0) {
      doanhThuTheoNgay();  // Chỉ chạy khi cả list và weekDays đều có dữ liệu
    }
  }, [list, weekDays]);

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
    <div className='h-full'>
      <div className='bg-white h-full w-full flex-col items-center justify-center p-2 border-gray-400 rounded-xl shadow-md shadow-gray-700'>
        <div className='flex px-2 mt-2 items-center justify-between'>
          <h3 className='text-2xl font-bold text-gray-700'>Doanh thu theo ngày</h3>
          <div>
            <div className='flex items-center justify-center'>
              <p className={`rounded-md font-extrabold text-xl m-2 hover:bg-blue-600 cursor-pointer`} onClick={e => getToDay('previous')}><i className="ri-arrow-left-s-fill"></i></p>
              <div className='flex'>
                <p className={`p-2 px-4 rounded-md border-2 text-gray-500 font-medium  m-auto mx-1 hover:bg-blue-400 hover:text-white cursor-pointer ${typeTime == 'week' ? 'bg-blue-400 text-white border-blue-400' : 'border-gray-400'}`} onClick={e => setTypeTime('week')}>Tuần</p>
                <p className={`p-2 px-4 rounded-md border-2 text-gray-500 font-medium  m-auto mx-1 hover:bg-blue-400 hover:text-white cursor-pointer ${typeTime == 'month' ? 'bg-blue-400 text-white border-blue-400' : 'border-gray-400'}`} onClick={e => setTypeTime('month')}>Tháng</p>
              </div>
              <p className={`rounded-md font-extrabold text-xl m-2 hover:bg-blue-600 cursor-pointer`} onClick={e => getToDay('next')}><i className="ri-arrow-right-s-fill"></i></p>
            </div>
            <div className='flex pt-2'>
              <input
                className='border border-gray-400 mx-2 rounded-md'
                type="date"
                value={weekDays.length > 0 ? formatToYYYYMMDD(parseDate(startDay)) : ''}
                onChange={e => {
                  const newStartDay = formatDate(new Date(e.target.value));
                  setStartDay(newStartDay);
                  getToDay('', newStartDay, endDay); // Update weekDays based on new start date and current end date
                }}
              />
              -
              <input
                className='border border-gray-400 mx-2 rounded-md'
                type="date"
                value={weekDays.length > 0 && formatToYYYYMMDD(parseDate(endDay))}
                onChange={(e) => {
                  const newEndDay = formatDate(new Date(e.target.value));
                  setEndDay(newEndDay);
                  getToDay('', startDay, newEndDay); // Update weekDays based on startDay and new end date
                }}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-1'>
          <BarChart
            colors={[
              '#5C8ED4',
              '#5FBF7A',
              '#FFDD54',
              '#C576B8',
              '#FF7E4D',
              '#4ED5D4',
              '#D68CD8',
              '#FFB84D',
              '#A66EDB',
              '#FF7F92',
            ]}
            xAxis={[
              {
                id: 'barCategories',
                data: weekDays.length > 0 ? weekDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                scaleType: 'band',
                categoryGapRatio: 0.2,
              },
            ]}
            series={[

              { data: doanhThu, stack: 'total' },
              // Dữ liệu doanh thu theo ngày
              // label: 'Doanh thu',
              // color: '#186eff',  // Nhãn cho loạt dữ liệu

            ]}
            width={widthChart}
            height={350}
            borderRadius={0}
          />
        </div>
      </div>
    </div>
  )
}

export default RevenueChart