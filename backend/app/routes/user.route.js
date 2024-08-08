const express = require("express");
const user = require("../controllers/user.controller");
const middleware = require("../middleware/middleware")
const router = express.Router();

// Đặt Sân 
router.route("/booking")
    .get(user.findAllBookingUser)
    .post(middleware.verifyAdmin, user.createBooking)
router.route("/booking/:id")
    .get(user.findOneBooking)
    .put(middleware.verifyAdmin, user.updateBooking);
   

// Tài khoản cá nhân
router.route("/")
    .get(middleware.verifyAdmin, user.findAll)
    .post(user.create);

router.route("/login").post(user.login);
router.route("/refresh").post(middleware.verifyToken, user.refreshToken);
router.route("/logout").post(middleware.verifyToken, user.logout);

router.route("/:id")
    .delete(middleware.verifyAdmin, user.deleteOne)
    .get(user.findOne)
    .put(middleware.verifyAdmin, user.update);


module.exports = router;