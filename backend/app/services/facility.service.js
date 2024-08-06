const db = require('./db.service')
const Facility = require('../models/facility.model');

class Facilities extends db {
  constructor() {
    super(Facility);
  }
}

module.exports = Facilities;