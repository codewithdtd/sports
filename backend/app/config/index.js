const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sports"
        // uri: 'mongodb+srv://test_01:123@cluster0.ghnnihw.mongodb.net/restaurant'
    }
};
module.exports = config;