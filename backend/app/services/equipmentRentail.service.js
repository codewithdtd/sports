const db = require('./db.service')
const EquipmentRentail = require('../models/equipmentRentail.model');

class EquipmentRentails extends db {
  constructor() {
    super(EquipmentRentail);
  }
}

module.exports = EquipmentRentails;