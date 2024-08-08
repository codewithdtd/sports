const db = require('./db.service')
const Staff = require('../models/staff.model.');

class Staffs extends db {
  constructor() {
    super(Staff);
  }

  // You can add user-specific methods here if needed
}

module.exports = Staffs;