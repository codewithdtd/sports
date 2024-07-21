const db = require('./db.service')
const User = require('../models/user.model');

class Users extends db {
  constructor() {
    super(User);
  }

  // You can add user-specific methods here if needed
}

module.exports = Users;