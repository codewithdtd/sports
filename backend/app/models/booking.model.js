const mongoose = require('mongoose');

// Chi tiết đặt sân
const bookingDetailSchema = new mongoose.Schema({
  maSan: { type: String, required: true },
  tenSan: { type: String, required: true },
  thoiGianBatDau: { type: String, required: true },
  thoiGianKetThuc: { type: String, required: true },
  datCoc: { type: Number },
  thanhTien: { type: Number, required: true },
}, { _id: false });


const bookingSchema = new mongoose.Schema({
  ma_KH: { type: String, required: true },
  trangThai: { type: String, },
  tongTien: { type: Number, required: true },
  chiTietDatSan: { type: [bookingDetailSchema], required: true },
  ngayDat: { type: String, },
  da_xoa: { type: Boolean, default: false },
});



bookingSchema.pre('save', function (next) {
  if (!this.ngayDat) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayDat = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'Dat_san'; 
const Booking = mongoose.model('Dat_san', bookingSchema, collectionName);

module.exports = Booking;