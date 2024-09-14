const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  khachHang: { type: Object, required: true },
  san: { type: Object, required: true },
  soGio: { type: Number, required: true },
  tongTien: { type: Number, required: true },
  da_xoa: { type: Boolean, default: false },
});



cartSchema.pre('save', function (next) {
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

const collectionName = 'gio_hang'; 
const Cart = mongoose.model('gio_hang', cartSchema, collectionName);

module.exports = Cart;