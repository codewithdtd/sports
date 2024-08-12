const mongoose = require('mongoose');

// Sự kiện

const eventSchema = new mongoose.Schema({
  ten_SK: { type: String, required: true },
  loai_SK: { type: String, required: true },
  giaiThuong: { type: String, required: true },
  ngayBatDau_SK: { type: String, },
  ngayKetThuc_SK: { type: String },
  ngayTao_SK: { type: String },
  da_xoa: { type: Boolean, default: false },
});



eventSchema.pre('save', function (next) {
  if (!this.ngayTao_SK) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_SK = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'su_kien'; 
const Event = mongoose.model('su_kien', eventSchema, collectionName);



// đăng ký sk
const eventUserSchema = new mongoose.Schema({
  ma_KH: { type: String, required: true },
  ma_SK: { type: String, required: true },
  giaiThuong: { type: String, },
  ngayDangKy: { type: String },
  da_xoa: { type: Boolean, default: false },
});



eventUserSchema.pre('save', function (next) {
  if (!this.ngayDangKy) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayDangKy = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName2 = 'dang_ky_su_kien'; 
const UserEvent = mongoose.model('dang_ky_su_kien', eventUserSchema, collectionName2);


module.exports = { UserEvent, Event };