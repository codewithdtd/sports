const Users = require("../services/user.service");

exports.create = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res, next) => {
    res.send({ message: "Login" });
};

exports.logout = async (req, res, next) => {
    res.send({ message: "Logout" });
};

exports.findAll = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOne = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.findOne(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOne = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


