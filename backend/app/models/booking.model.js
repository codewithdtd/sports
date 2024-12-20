const mongoose = require('mongoose');

// Chi tiết đặt sân
// const bookingDetailSchema = new mongoose.Schema({
//   ma_San: { type: String, required: true },
//   ten_San: { type: String, required: true },
//   ngayDat: { type: String, required: true },
//   thoiGianBatDau: { type: String, required: true },
//   thoiGianKetThuc: { type: String, required: true },
//   thanhTien: { type: Number, required: true },
// }, { _id: false });


const bookingSchema = new mongoose.Schema({
  khachHang: { type: Object, required: true },
  trangThai: { type: String, default: 'Chưa duyệt', },
  trangThaiThanhToan: { type: String, default: 'Chưa thanh toán', },
  san: { type: Object, required: true },
  thoiGianBatDau: { type: String, required: true },
  thoiGianKetThuc: { type: String, required: true },
  thoiGianCheckIn: { type: String, default: '--:--'},
  thoiGianCheckOut: { type: String, default: '--:--' },
  dichVu: { type: [Object], },
  thanhTien: { type: Number, required: true },
  // hoiVien: { type: String, },
  ghiChu: { type: String },
  dichVu: { type: Array, },
  yeuCauHuy: { type: Boolean, default: false},
  maGiaoDich: { type: String, },
  zp_trans_id: { type: String, },
  phuThu: { type: Number },
  ngayDat: { type: String, required: true},
  ngayTao: { type: String, },
  order_url: { type: String, },
  expireAt: { type: Date, default: null, },
  da_xoa: { type: Boolean, default: false },
});



bookingSchema.pre('save', function (next) {
  if (!this.ngayTao) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  if (!this.trangThai || this.trangThai === '') {
      this.trangThai = 'Chưa duyệt';
  }
  if (!this.trangThaiThanhToan || this.trangThaiThanhToan === '') {
      this.trangThaiThanhToan = 'Chưa thanh toán';
  }if (this.order_url !== '' && this.order_url) {
      this.expireAt =  new Date(Date.now());
  }
  next();
});

const collectionName = 'dat_san'; 
const Booking = mongoose.model('dat_san', bookingSchema, collectionName);

module.exports = Booking;