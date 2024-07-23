const mongoose = require('mongoose');

async function connect(uri) {
    try {
        await mongoose.connect(uri);
        console.log("Connect database successfully!!!");
    } catch (error) {
        console.log("Connect failure!!!")

    }
}

module.exports = { connect }