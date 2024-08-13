const db = require('./db.service')
const Review = require('../models/review.model');

class Reviews extends db {
  constructor() {
    super(Review);
  }
}

module.exports = Reviews;