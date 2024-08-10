const db = require('./db.service')
const EquipmentMD = require('../models/equipment.model');

class Equipment extends db {
  constructor() {
    super(EquipmentMD);
  }
}

module.exports = Equipment;