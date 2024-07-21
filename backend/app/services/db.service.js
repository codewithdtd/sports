const mongoose = require('mongoose');

class DBHandler {
  constructor(model) {
    this.model = model;
  }
  
  async create(data) {
    try {
      const newDocument = new this.model(data);
      const result = await newDocument.save();
      return result;
    } catch (err) {
      throw new Error('Error adding document: ' + err.message);
    }
  }

  async findOne(id) {
    try {
      const result = await this.model.findById(id);
      if (!result) {
        throw new Error('Document not found');
      }
      return result;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }

  async findAll() {
    try {
      const results = await this.model.find({ "da_xoa": false });
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }


  async update(id, data) {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, { new: true });
      return result;
    } catch (err) {
      throw new Error('Error updating document: ' + err.message);
    }
  }

  async delete(id) {
    try {
      const result = await this.model.findByIdAndUpdate(id, {"da_xoa": true}, { new: true });
      return result;
    } catch (err) {
      throw new Error('Error deleting document: ' + err.message);
    }
  }
}

module.exports = DBHandler;