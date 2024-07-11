exports.create = async (req, res, next) => {
    return res.send({ message: "Create" });
};

exports.update = async (req, res, next) => {
    return res.send({ message: "Update" });
};

exports.login = async (req, res, next) => {
    res.send({ message: "Login" });
};

exports.logout = async (req, res, next) => {
    res.send({ message: "Logout" });
};

exports.findAll = async (req, res, next) => {
    res.send({ message: "Find all" });
};

exports.findOne = async (req, res, next) => {
    res.send({ message: "Find One" });
};

exports.deleteOne = async (req, res, next) => {
    res.send({ message: "Delete One" });
};


