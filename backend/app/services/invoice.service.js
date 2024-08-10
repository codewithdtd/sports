const db = require('./db.service')
const Invoice = require('../models/invoice.model');

class Invoices extends db {
  constructor() {
    super(Invoice);
  }

  // You can add user-specific methods here if needed
}

module.exports = Invoices;