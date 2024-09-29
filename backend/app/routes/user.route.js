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
router.route("/review/find")
    .post(user.findOneReview)

// Giỏ hàng
router.route("/cart")
    .get(user.findAllCart)
    .post(user.createCart)
router.route("/cart/:id")
    .get(user.findOneCart)
    .put(user.updateCart);


// Hóa đơn
router.route("/invoice/:id")
    .get(user.findAllInvoiceUser)

// Đặt Sân 
router.route("/booking")
    .get(middleware.verifyAdmin ,user.findAllBookingUser)
    .post(middleware.verifyToken, user.createBooking)
router.route("/booking/:id")
    .get(user.findOneBooking)
    .put(user.updateBooking);
   
// Hội viên
// 
router.route("/userMembership")
    .get(user.findAllUserMembership)
    .post(user.createUserMembership)
router.route("/userMembership/:id")
    .get(user.findOneUserMembership)
    .put(user.updateUserMembership)
    .delete(user.deleteOneUserMembership);

// Tài khoản cá nhân
router.route("/login").post(user.login);
router.route("/refresh").post(user.refreshToken);
router.route("/logout").post(middleware.verifyToken, user.logout);

router.route("/:id")
    .delete(middleware.verifyAdmin, user.deleteOne)
    .get(user.findOne)
    .put(middleware.verifyAdmin, user.update);
    
router.route("/")
    .get( user.findAll)
    .post(user.create);



module.exports = router;