const mongoose = require('mongoose');


const sportTypeSchema = new mongoose.Schema({
  ten_loai: { type: String, required: true },
  hinhAnh: { type: Array, },
  hinhAnhDaiDien: { type: String, },
  ngayTao: { type: String },
  da_xoa: { type: Boolean, default: false },
});



sportTypeSchema.pre('save', function (next) {
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
  next();
});

const collectionName = 'loai_san'; 
const sportType = mongoose.model('loai_san', sportTypeSchema, collectionName);

module.exports = sportType;