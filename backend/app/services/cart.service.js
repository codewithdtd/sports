const db = require('./db.service')
const Cart = require('../models/cart.model');

class Carts extends db {
  constructor() {
    super(Cart);
  }
}

module.exports = Carts;