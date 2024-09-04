const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({
  ten_DV: { type: String, required: true },
  dungCu: { type: Object, required: true },
  gia: { type: Number, required: true },
  ngayTao_DV: { type: String },
  da_xoa: { type: Boolean, default: false },
});



serviceSchema.pre('save', function (next) {
  if (!this.ngayTao_DV) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_DV = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'dich_vu'; 
const Service = mongoose.model('dich_vu', serviceSchema, collectionName);

module.exports = Service;