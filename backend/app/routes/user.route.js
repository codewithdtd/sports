const express = require("express");
const user = require("../controllers/user.controller");
const middleware = require("../middleware/middleware")
const router = express.Router();

router.route("/")
    .get(middleware.verifyToken, user.findAll)
    .post(user.create);

router.route("/login").post(user.login);
router.route("/refresh").post(user.refreshToken);
router.route("/logout").post(user.logout);

router.route("/:id")
    .delete(middleware.verifyAdmin, user.deleteOne)
    .get(user.findOne)
    .put(user.update)

module.exports = router;