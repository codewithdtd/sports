const mongoose = require('mongoose');


const setTimeSchema = new mongoose.Schema({
  thoiGianMoCua: { type: String, required: true },
  thoiGianDongCua: { type: String, required: true },
  da_xoa: { type: Boolean, default: false },
});



const collectionName = 'thoi_gian'; 
const Time = mongoose.model('thoi_gian', setTimeSchema, collectionName);

module.exports = Time;