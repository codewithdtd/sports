const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  ho_NV: { type: String, required: true},
  ten_NV: { type: String, required: true},
  email_NV: { type: String, },
  sdt_NV: { type: String, required: true, },
  matKhau_NV: { type: String, required: true },
  hinhAnh_NV: { type: String, },
  chuc_vu: { type: String, default: "admin" },
  ngayTao_NV: { type: String, },
  ngayCapNhat_NV: { type: String, },
  da_xoa: { type: Boolean, default: false },
});

staffSchema.pre('save', function (next) {
  if (!this.ngayTao_NV) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_AD = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'nhan_vien'; 
const Staff = mongoose.model('nhan_vien', staffSchema, collectionName);

module.exports = Staff;