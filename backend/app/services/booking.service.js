const db = require('./db.service')
const Booking = require('../models/booking.model');

class Bookings extends db {
  constructor() {
    super(Booking);
  }
  async findAllBookingUser(id) {
    try {
      const result = await this.model.find({"ma_KH": id});
      if (!result) {
        throw new Error('Document not found');
      }
      return result;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  async findBookingBooked(payload) {
    try {
      let query = {
        ngayDat: payload.ngayDat,
        thoiGianBatDau: { $gte: '08:00' },
        thoiGianKetThuc: { $lte: '22:00' },
      };
      // Nếu có điều kiện thời gian bắt đầu, thêm vào điều kiện truy vấn
      if (payload.thoiGianBatDau != '' && payload.thoiGianBatDau) {
          console.log('have')
          query.thoiGianBatDau = { $gte: payload.thoiGianBatDau };
      }

      // Nếu có điều kiện thời gian kết thúc, thêm vào điều kiện truy vấn
      if (payload.thoiGianKetThuc != '' && payload.thoiGianKetThuc) {
          query.thoiGianKetThuc = { $lte: payload.thoiGianKetThuc };
      }
      const result = await this.model.find(query);
      if (!result) {
        throw new Error('Document not found');
      }
      console.log(query)
      return result
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  async findBookingBookedExact(payload) {
    try {
      let query = {
        ngayDat: payload.ngayDat
      };

      // Nếu có điều kiện thời gian bắt đầu, thêm vào điều kiện truy vấn
      if (payload.thoiGian != '') {
          query.thoiGianBatDau = { $gte: payload.thoiGian };
          query.thoiGianKetThuc = { $lte: payload.thoiGian };
      }
      const result = await this.model.find(query);
      if (!result) {
        throw new Error('Document not found');
      }
      return result
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
    //   Xóa phần tử trong mảng chi tiết đặt sân
  // async removeBookingDetail(bookingId, maSan) {
  //   try {
  //     const booking = await Booking.findById(bookingId);
  //     if (!booking) {
  //       console.error('Booking not found!');
  //       return;
  //     }

  //     // Tìm và xóa phần tử trong mảng chiTietDatSan
  //     booking.chiTietDatSan = booking.chiTietDatSan.filter(detail => detail.maSan !== maSan);


  //     const result = await booking.save();
  //     console.log('Booking detail removed successfully!');
  //     return result; 
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  //   thêm chi tiết đặt sân mới vào 
  // async addBookingDetail(bookingId, newDetail) {
  //   try {
  //     const booking = await Booking.findById(bookingId);
  //     if (!booking) {
  //       console.error('Booking not found!');
  //       return;
  //     }

  //     // thêm phần tử trong mảng chiTietDatSan
  //     booking.chiTietDatSan = booking.chiTietDatSan.push(newDetail);

  //     // Lưu lại đối tượng đã được cập nhật
  //     const result = await booking.save();
  //     console.log('Booking detail added successfully!');
  //     return result; 
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

}

module.exports = Bookings;