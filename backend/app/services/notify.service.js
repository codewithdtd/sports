const db = require('./db.service')
const Notify = require('../models/notify.model');

class Notifies extends db {
  constructor() {
    super(Notify);
  }
}

module.exports = Notifies;