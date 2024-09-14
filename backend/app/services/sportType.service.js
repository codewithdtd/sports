const db = require('./db.service')
const SportType = require('../models/sportType.model');

class SportTypes extends db {
  constructor() {
    super(SportType);
  }
  async deleteImage(id, imagePath) {
     try {
      const result = await this.model.findByIdAndUpdate(id, {
      $pull: { hinhAnh: imagePath }
    });
      return result;
    } catch (err) {
      throw new Error('Error deleting document: ' + err.message);
    }
  }
}

module.exports = SportTypes;