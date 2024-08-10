const express = require("express");
const admin = require("../controllers/admin.controller");
const middleware = require("../middleware/middleware");
const { create } = require("../models/staff.model.");
const router = express.Router();

// NHÂN VIÊN
router.route("/staff")
    .get(middleware.verifyAdmin, admin.findAllStaff)
    .post(admin.createStaff);

router.route("/login").post(admin.login);
router.route("/refresh").post(middleware.verifyToken, admin.refreshToken);
router.route("/logout").post(middleware.verifyToken, admin.logout);

router.route("/staff/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneStaff)
    .get(admin.findOneStaff)
    .put(middleware.verifyAdmin, admin.updateStaff);



//Sân thể thao
router.route("/facility")
    .get(admin.findAllFacility)
    .post(middleware.verifyAdmin, admin.createFacility)
router.route("/facility/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneFacility)
    .get(admin.findOneFacility)
    .put(middleware.verifyAdmin, admin.updateFacility);
   

//Đặt sân
router.route("/booking")
    .get(admin.findAllBooking)
    .post(middleware.verifyAdmin, admin.createBooking)
router.route("/booking/:id")
    .get(admin.findOneBooking)
    .put(middleware.verifyAdmin, admin.updateBooking);
   
// Hóa đơn
// 
// 
router.route("/invoice")
    .get(admin.findAllInvoice)
    .post(admin.createInvoice)
router.route("/invoice/:id")
    .get(admin.findOneInvoice)
    .put(admin.updateInvoice);
   
module.exports = router;