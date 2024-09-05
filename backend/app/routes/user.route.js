const express = require("express");
const user = require("../controllers/user.controller");
const middleware = require("../middleware/middleware")
const router = express.Router();

// Đánh giá
router.route("/review")
    .get(user.findAllReview)
    .post(user.createReview)
router.route("/review/:id")
    .get(user.findOneReview)
    .put(user.updateReview);
   
// Đặt Sân 
router.route("/booking")
    .get(user.findAllBookingUser)
    .post(middleware.verifyAdmin, user.createBooking)
router.route("/booking/:id")
    .get(user.findOneBooking)
    .put(middleware.verifyAdmin, user.updateBooking);
   
// Hội viên
// 
router.route("/userMembership")
    .get(user.findAllUserMembership)
    .post(user.createUserMembership)
router.route("/userMembership/:id")
    .get(user.findOneUserMembership)
    .put(user.updateUserMembership);

// Tài khoản cá nhân
router.route("/login").post(user.login);
router.route("/refresh").post(middleware.verifyToken, user.refreshToken);
router.route("/logout").post(middleware.verifyToken, user.logout);

router.route("/:id")
    .delete(middleware.verifyAdmin, user.deleteOne)
    .get(user.findOne)
    .put(middleware.verifyAdmin, user.update);
    
router.route("/")
    .get( user.findAll)
    .post(user.create);



module.exports = router;