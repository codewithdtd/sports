const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ho_KH: { type: String, required: true},
  ten_KH: { type: String, required: true},
  email_KH: { type: String, unique: true },
  sdt_KH: { type: String, required: true, unique: true },
  matKhau_KH: { type: String, required: true },
  hinhAnh_KH: { type: String, },
  ngayTao_KH: { type: String, },
  ngayCapNhat_KH: { type: String, },
  da_xoa: { type: Boolean, default: false },
});

userSchema.pre('save', function (next) {
  if (!this.ngayTao_KH) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_KH = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'khach_hang'; 
const User = mongoose.model('khach_hang', userSchema, collectionName);

module.exports = User;