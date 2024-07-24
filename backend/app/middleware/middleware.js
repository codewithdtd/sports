const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if(token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
            if(err) {
                return next(
                    new ApiError(403, "Token is not valid!")
                );
            }
            req.user = user;
            next();
        })
    }
    else {
        return next(
            new ApiError(401, "You're not authenticated!")
        );
    }
}

exports.verifyAdmin = async (req, res, next) => {
    this.verifyToken(req, res, () => {
        console.log(req.user)
        if(req.user.id == req.params.id || req.user.role == 'admin') {
            next()
        } else {
            return next(
                new ApiError(403, "You're not allowed!")
            );
        }
    })
}