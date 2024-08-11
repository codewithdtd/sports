const db = require('./db.service')
const { Membership, UserMembership } = require('../models/membership.model');

class Memberships extends db {
  constructor() {
    super(Membership);
  }
}

class UserMemberships extends db {
  constructor() {
    super(UserMembership);
  }
}

module.exports = { Memberships, UserMemberships };