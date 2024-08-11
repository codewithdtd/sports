const mongoose = require('mongoose');


const equipmentSchema = new mongoose.Schema({
  ten_DC: { type: String, required: true },
  gia_DC: { type: Number, required: true },
  trangThai_DC: { type: String, default: "Sẵn có" },
  hinhAnh_DC: { type: String },
  soLuongTonKho: { type: Number, required: true },
  soLuongHuHong: { type: Number, required: true },
  ma_Loai_DC: { type: String, required: true },
  ngayTao: { type: String },
  da_xoa: { type: Boolean, default: false },
});



equipmentSchema.pre('save', function (next) {
  if (!this.ngayTao) {
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

const collectionName = 'dung_cu'; 
const EquipmentMD = mongoose.model('dung_cu', equipmentSchema, collectionName);

module.exports = EquipmentMD;