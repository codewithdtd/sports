const mongoose = require('mongoose');

class DBHandler {
  constructor(model) {
    this.model = model;
  }
  
  async create(data) {
    try {
      const newDocument = new this.model(data);
      const result = await newDocument.save();
      return result;
    } catch (err) {
      throw new Error('Error adding document: ' + err.message);
    }
  }

  async findById(id) {
    try {
      const result = await this.model.findById(id);
      if (!result) {
        throw new Error('Document not found');
      }
      return result;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }

  async findOne(data) {
    try {
      const find = {...data, "da_xoa": false}
      const results = await this.model.findOne(find);
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  
  async find(data) {
    try {
      const find = {...data, "da_xoa": false}
      const results = await this.model.find(find);
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }

  async findAll() {
    try {
      const results = await this.model.find({ "da_xoa": false });
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  async findAllDelete() {
    try {
      const results = await this.model.find({});
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  async findAllBookedExact(time) {
    try {
      const results = await this.model.aggregate([
          {
              $addFields: {
                  _idAsString: { $toString: "$_id" } // Chuyển ObjectId thành chuỗi
              }
          },
          {
              $lookup: {
                  from: "dat_san", 
                  localField: "_idAsString", 
                  foreignField: "san._id", 
                  as: "datSan" 
              }
          },
          {
              $unwind: {
                  path: "$datSan", 
                  preserveNullAndEmptyArrays: true 
              }
          },
          {
            $match: {
              $or: [
                {
                  "datSan.trangThai": { $nin: ["Đã hủy", "Hoàn thành"] },
                  "datSan.ngayDat": time.ngayDat,
                  "datSan.thoiGianBatDau": { $lte: time.thoiGian },
                  "datSan.thoiGianKetThuc": { $gte: time.thoiGian }
                },
                {
                  "tinhTrang": "Đang sử dụng",
                  "datSan.trangThai": "Nhận sân"
                },
                {
                  "datSan.trangThai": "Nhận sân"
                }
              ]
            }   
          }
      ]);
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }

  async findAllBooked(time) {
    try {
      const results = await this.model.aggregate([
          {
              $addFields: {
                  _idAsString: { $toString: "$_id" } // Chuyển ObjectId thành chuỗi
              }
          },
          {
              $lookup: {
                  from: "dat_san", 
                  localField: "_idAsString", 
                  foreignField: "san._id", 
                  as: "datSan" 
              }
          },
          {
              $unwind: {
                  path: "$datSan", 
                  preserveNullAndEmptyArrays: true 
              }
          },
          {
            $match: {
              "datSan.trangThai": { $ne: "Đã hủy" },
              "datSan.ngayDat": time.ngayDat,
              // "datSan.thoiGianBatDau": { $gte: '08:00' },
              // "datSan.thoiGianKetThuc": { $lte: '22:00' }
            }   
          }
      ]);
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }


  async update(id, data) {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, { new: true });
      return result;
    } catch (err) {
      throw new Error('Error updating document: ' + err.message);
    }
  }

  async delete(id) {
    try {
      const result = await this.model.findByIdAndUpdate(id, {"da_xoa": true}, { new: true });
      return result;
    } catch (err) {
      throw new Error('Error deleting document: ' + err.message);
    }
  }
  async findAllUser(id) {
    try {
      const result = await this.model.find({"ma_KH": id});
      if (!result) {
        throw new Error('Document not found');
      }
      return result;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
}

module.exports = DBHandler;