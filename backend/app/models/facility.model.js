const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  ten_San: { type: String, required: true},
  loai_San: { type: String, require: true },
  tinhTrang: { type: String, required: true, default: "Trống" },
  khuVuc: { type: String, required: true },
  bangGioMoiGio: { type: Number, require: true },
  sucChua: { type: Number, },
  hinhAnh_San: { type: String, },
  ngayTao_San: { type: String, },
  ngayCapNhat_San: { type: String, },
  da_xoa: { type: Boolean, default: false },
});

facilitySchema.pre('save', function (next) {
  if (!this.ngayTao_San) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    this.ngayTao_San = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  next();
});

const collectionName = 'san_the_thao'; 
const Facility = mongoose.model('san_the_thao', facilitySchema, collectionName);

module.exports = Facility;