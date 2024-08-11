const db = require('./db.service')
const { Event, UserEvent } = require('../models/event.model');

class Events extends db {
  constructor() {
    super(Event);
  }
}

class UserEvents extends db {
  constructor() {
    super(UserEvent);
  }
}

module.exports = { Events, UserEvents };