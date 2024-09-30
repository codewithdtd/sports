const db = require('./db.service')
const Contact = require('../models/contact.model');

class Contacts extends db {
  constructor() {
    super(Contact);
  }
}

module.exports = Contacts;