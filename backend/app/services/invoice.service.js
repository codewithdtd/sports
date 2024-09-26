const db = require('./db.service')
const Invoice = require('../models/invoice.model');

class Invoices extends db {
  constructor() {
    super(Invoice);
  }
  async finAllInvoiceUser(id) {
    try {
      const results = await this.model.find({ "khachHang._id": id,"da_xoa": false });
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }

  // You can add user-specific methods here if needed
}

module.exports = Invoices;