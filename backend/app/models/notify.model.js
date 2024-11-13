const mongoose = require('mongoose');


const notifySchema = new mongoose.Schema({
  nguoiDung: { type: String, required: true },
  tieuDe: { type: String, required: true },
  noiDung: { type: String, required: true },
  daXem: { type: Boolean, default: false },
  ngayTao: { type: String },
  da_xoa: { type: Boolean, default: false },
});



notifySchema.pre('save', function (next) {
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

const collectionName = 'thong_bao'; 
const Service = mongoose.model('thong_bao', notifySchema, collectionName);

module.exports = Service;