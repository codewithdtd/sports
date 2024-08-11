const mongoose = require('mongoose');

// Gói hội viên

const membershipSchema = new mongoose.Schema({
  ten_GoiHV: { type: String, required: true, unique: true },
  gia_GoiHV: { type: Number, required: true },
  thoiHan: { type: String, },
  quyenLoi: { type: String },
  ngayTao_GoiHV: { type: String },
  da_xoa: { type: Boolean, default: false },
});



membershipSchema.pre('save', function (next) {
  if (!this.ngayTao_GoiHV) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_GoiHV = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'goi_hoi_vien'; 
const Membership = mongoose.model('goi_hoi_vien', membershipSchema, collectionName);



// Hội viên
const userMembershipSchema = new mongoose.Schema({
  ma_KH: { type: String, required: true },
  ma_GoiHV: { type: String, required: true },
  ngayBatDau_HV: { type: String, },
  ngayKetThuc_HV: { type: String, required: true},
  trangThai: { type: String, },
  giaHan: { type: Boolean, default: false },
  da_xoa: { type: Boolean, default: false },
});



userMembershipSchema.pre('save', function (next) {
  if (!this.ngayBatDau_HV) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayBatDau_HV = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName2 = 'hoi_vien'; 
const UserMembership = mongoose.model('hoi_vien', userMembershipSchema, collectionName2);


module.exports = { UserMembership, Membership };