const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  khachHang: { type: Object, required: true },
  danhGia: { type: String, },
  noiDung: { type: String, required: true },
  datSan: { type: Object, },
  phanHoi: { type: Object, },
  ngayTao_DG: { type: String },
  da_an: {type: Boolean, default: false},
  da_xoa: { type: Boolean, default: false },
});



reviewSchema.pre('save', function (next) {
  if (!this.ngayTao_DG) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_DG = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'danh_gia'; 
const Review = mongoose.model('danh_gia', reviewSchema, collectionName);

module.exports = Review;