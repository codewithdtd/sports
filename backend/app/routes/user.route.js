const express = require("express");
const user = require("../controllers/user.controller");
const middleware = require("../middleware/middleware")
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './app/uploads/'); // Thư mục lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({ 
    storage: storage ,
    limits: {
        fileSize: 1024 * 1024 * 5, // Giới hạn kích thước file là 5MB
    },
});

// Liên hệ
router.route("/contact")
    .post(user.createContact)
// Đánh giá
router.route("/review")
    .get(user.findAllReview)
    .post(middleware.verifyToken, user.createReview)
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
router.route("/invoice/findOne/:id")
    .get(user.findOneInvoiceUser)
// Đặt Sân 
router.route("/booking")
    .get(middleware.verifyToken ,user.findAllBookingUser)
    .post(middleware.verifyToken, user.createBooking)
router.route("/booking/:id")
    .get(user.findOneBooking)
    .put(middleware.verifyToken, user.updateBooking);
   
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
    .put(middleware.verifyAdmin, upload.single('hinhAnh_KH'), user.update);
    
router.route("/")
    .get(user.findAll)
    .post(user.create);

router.route("/payment")
    .post(user.payment)

router.route("/callback")
    .post(user.callback)

router.route("/payment-status/:app_trans_id")
    .post(user.paymentStatus)

router.route("/refund")
    .post(user.refund)

    // Gửi email
router.route("/email").post(user.sendEmail);

module.exports = router;
