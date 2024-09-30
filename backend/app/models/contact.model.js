const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  sdt: { type: String, required: true},
  email: { type: String },
  noiDung: { type: String, required: true },
  ngayTao: { type: String },
  da_xoa: { type: Boolean, default: false },
});



contactSchema.pre('save', function (next) {
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

const collectionName = 'lien_he'; 
const Review = mongoose.model('lien_he', contactSchema, collectionName);

module.exports = Review;