const express = require("express");
const user = require("../controllers/user.controller");

const router = express.Router();

router.route("/")
    .get(user.findAll)
    .post(user.create);

router.route("/login").post(user.login);
router.route("/logout").post(user.logout);

router.route("/:id")
    .delete(user.deleteOne)
    .get(user.findOne)
    .put(user.update)

module.exports = router;