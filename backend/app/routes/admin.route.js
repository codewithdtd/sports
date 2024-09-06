const express = require("express");
const admin = require("../controllers/admin.controller");
const middleware = require("../middleware/middleware");
const router = express.Router();

// NHÂN VIÊN
router.route("/staff")
    .get(middleware.verifyAdmin, admin.findAllStaff)
    .post(admin.createStaff);

router.route("/staff/login").post(admin.login);
router.route("/staff/refresh").post(middleware.verifyToken, admin.refreshToken);
router.route("/staff/logout").post(middleware.verifyToken, admin.logout);

router.route("/staff/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneStaff)
    .get(admin.findOneStaff)
    .put(middleware.verifyAdmin, admin.updateStaff);



//Sân thể thao
router.route("/facility")
    .get( admin.findAllFacility)
    .post( admin.createFacility)
router.route("/facility/booked-exact")
    .get(admin.findAllFacilityBookingExact)
router.route("/facility/booked")
    .get(admin.findAllFacilityBooking)
router.route("/facility/:id")
    .delete(admin.deleteOneFacility)
    .get(admin.findOneFacility)
    .put( admin.updateFacility);

//Đặt sân
router.route("/booking")
    .get(admin.findAllBooking)
    .post(admin.createBooking)
router.route("/booking/:id")
    .get(admin.findOneBooking)
    .put(admin.updateBooking);
   
// Hóa đơn
// 
// 
router.route("/invoice")
    .get(admin.findAllInvoice)
    .post(admin.createInvoice)
router.route("/invoice/:id")
    .get(admin.findOneInvoice)
    .put(admin.updateInvoice);

// 
// Dụng cụ thiết bị
// 
router.route("/equipment")
    .get(admin.findAllEquipment)
    .post(middleware.verifyAdmin, admin.createEquipment)
router.route("/equipment/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneEquipment)
    .get(admin.findOneEquipment)
    .put(middleware.verifyAdmin, admin.updateEquipment);

// Phiếu nhập hàng
// 
router.route("/goodReceivedNote")
    .get(admin.findAllGoodReceivedNote)
    .post(admin.createGoodReceivedNote)
router.route("/goodReceivedNote/:id")
    .delete(admin.deleteOneGoodReceivedNote)
    .get(admin.findOneGoodReceivedNote)
    .put(admin.updateGoodReceivedNote);

// Gói hội viên
// 
router.route("/membership")
    .get(admin.findAllMembership)
    .post(admin.createMembership)
router.route("/membership/:id")
    .delete(admin.deleteOneMembership)
    .get(admin.findOneMembership)
    .put(admin.updateMembership);

// Hội viên
// 
router.route("/userMembership")
    .get(admin.findAllUserMembership)
    .post(admin.createUserMembership)
router.route("/userMembership/:id")
    .delete(admin.deleteOneUserMembership)
    .get(admin.findOneUserMembership)
    .put(admin.updateUserMembership);

// Sự kiện
router.route("/event")
    .get(admin.findAllEvent)
    .post(admin.createEvent)
router.route("/event/:id")
    .delete(admin.deleteOneEvent)
    .get(admin.findOneEvent)
    .put(admin.updateEvent);
// Đăng ký sự kiện
router.route("/userEvent")
    .get(admin.findAllUserEvent)
    .post(admin.createUserEvent)
router.route("/userEvent/:id")
    .delete(admin.deleteOneUserEvent)
    .get(admin.findOneUserEvent)
    .put(admin.updateUserEvent);


// Đánh giá
router.route("/review")
    .get(admin.findAllReview)
    .post(admin.createReview)
router.route("/review/:id")
    .delete(admin.deleteOneReview)
    .get(admin.findOneReview)
    .put(admin.updateReview);


// Dịch vụ
router.route("/service")
    .get(admin.findAllService)
    .post(admin.createService)
router.route("/service/:id")
    .delete(admin.deleteOneService)
    .get(admin.findOneService)
    .put(admin.updateService);
module.exports = router;