const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  ma_DS: { type: String, required: true},
  ma_NV: { type: String, require: true },
  thoiGianCheckIn: { type: String, default: "-- : --" },
  thoiGiaCheckOut: { type: String, default: "-- : --" },
  bangGioMoiGio: { type: Number, required: true },
  ghiChu: { type: String, },
  phuongThucThanhToan: { type: String, required: true},
  tongTien: { type: Number, required: true, default: 0},
  ngayTao_HD: { type: String, },
  da_xoa: { type: Boolean, default: false },
});

invoiceSchema.pre('save', function (next) {
  if (!this.ngayTao_HD) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_HD = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'hoa_don'; 
const Invoice = mongoose.model('hoa_don', invoiceSchema, collectionName);

module.exports = Invoice;