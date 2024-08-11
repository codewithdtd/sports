const express = require("express");
const admin = require("../controllers/admin.controller");
const middleware = require("../middleware/middleware");
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
    .post(middleware.verifyAdmin, admin.createInvoice)
router.route("/invoice/:id")
    .get(admin.findOneInvoice)
    .put(middleware.verifyAdmin, admin.updateInvoice);

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
router.route("/equipmentRentail")
    .get(admin.findAllEquipmentRentail)
    .post(admin.createEquipmentRentail)
router.route("/equipmentRentail/:id")
    .delete(admin.deleteOneEquipmentRentail)
    .get(admin.findOneEquipmentRentail)
    .put(admin.updateEquipmentRentail);

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

module.exports = router;