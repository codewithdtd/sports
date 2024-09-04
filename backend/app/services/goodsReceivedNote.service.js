const db = require('./db.service')
const GoodsReceivedNote = require('../models/goodsReceivedNote.model');

class GoodsReceivedNotes extends db {
  constructor() {
    super(GoodsReceivedNote);
  }
}

module.exports = GoodsReceivedNotes;