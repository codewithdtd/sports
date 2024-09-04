// Nhập xuất kho
// 
// 
const mongoose = require('mongoose');

// Chi tiết phiếu nhập
const equipmentRentailDetailSchema = new mongoose.Schema({
  ma_DC: { type: String, required: true },
  ma_PN: { type: String, required: true },
  soLuong: { type: Number, required: true },
  giaMoi_DC: { type: Number, required: true },
  tongTien_DC: { type: Number, required: true },
});

// Phiếu nhập
const equipmentRentailSchema = new mongoose.Schema({
  ma_NV: { type: String, required: true },
  tongTien: { type: Number, required: true },
  ngayNhap: { type: String },
  chiTietPhieuNhap: { type: [equipmentRentailDetailSchema], required: true },
  ghiChu: { type: String },
  da_xoa: { type: Boolean, default: false },
});

equipmentRentailSchema.pre('save', function (next) {
  if (!this.ngayNhap) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayNhap = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'phieu_nhap'; 
const EquipmentRentail = mongoose.model('phieu_nhap', equipmentRentailSchema, collectionName);

module.exports = EquipmentRentail;
