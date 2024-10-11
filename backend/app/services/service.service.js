const db = require('./db.service')
const Service = require('../models/service.model');

class Services extends db {
  constructor() {
    super(Service);
  }
  async find(data) {
    try {
      const find = {...data, trangThai: {$nin: ["Hoàn thành", "Đã hủy"]}, "da_xoa": false}
      const results = await this.model.find(find);
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
}

module.exports = Services;