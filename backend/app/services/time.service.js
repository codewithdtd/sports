const db = require('./db.service')
const Time = require('../models/setTime.model');

class Times extends db {
  constructor() {
    super(Time);
  }
}

module.exports = Times;