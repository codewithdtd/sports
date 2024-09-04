const db = require('./db.service')
const Service = require('../models/service.model');

class Services extends db {
  constructor() {
    super(Service);
  }
}

module.exports = Services;