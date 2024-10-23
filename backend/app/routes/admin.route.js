const express = require("express");
const admin = require("../controllers/admin.controller");
const middleware = require("../middleware/middleware");
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

// NHÂN VIÊN
router.route("/staff")
    .get(middleware.verifyAdmin, admin.findAllStaff)
    .post(admin.createStaff);

router.route("/staff/login").post(admin.login);
router.route("/staff/refresh").post(admin.refreshToken);
router.route("/staff/logout").post(middleware.verifyToken, admin.logout);

router.route("/staff/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneStaff)
    .get(admin.findOneStaff)
    .put(middleware.verifyAdmin, upload.single('hinhAnh_NV'), admin.updateStaff);



//Sân thể thao
router.route("/facility/find")
    .post(admin.findFacility)
router.route("/facility")
    .get(middleware.verifyAdmin, admin.findAllFacility)
    .post(middleware.verifyAdmin, admin.createFacility)
router.route("/facility/booked-exact")
    .get(admin.findAllFacilityBookingExact)
router.route("/facility/booked")
    .get(admin.findAllFacilityBooking)
router.route("/facility/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneFacility)
    .get(admin.findOneFacility)
    .put(middleware.verifyAdmin, admin.updateFacility);

//Đặt sân
router.route("/booking/filter")
    .post(admin.filterBooking)
router.route("/booking/find")
    .post(admin.findBooking)
router.route("/booking/today")
    .post(admin.findAllBookingToday)
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
router.route("/goodReceivedNote")
    .get(admin.findAllGoodReceivedNote)
    .post(middleware.verifyAdmin, admin.createGoodReceivedNote)
router.route("/goodReceivedNote/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneGoodReceivedNote)
    .get(admin.findOneGoodReceivedNote)
    .put(middleware.verifyAdmin, admin.updateGoodReceivedNote);

// Gói hội viên
// 
router.route("/membership")
    .get(admin.findAllMembership)
    .post(middleware.verifyAdmin, admin.createMembership)
router.route("/membership/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneMembership)
    .get(admin.findOneMembership)
    .put(middleware.verifyAdmin, admin.updateMembership);

// Hội viên
// 
router.route("/userMembership/filter")
    .post(middleware.verifyAdmin, admin.findAllUserMembership)
router.route("/userMembership")
    .get(admin.findAllUserMembership)
    .post(middleware.verifyAdmin, admin.createUserMembership)
router.route("/userMembership/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneUserMembership)
    .get(admin.findOneUserMembership)
    .put(middleware.verifyAdmin, admin.updateUserMembership);

// Sự kiện
router.route("/event")
    .get(admin.findAllEvent)
    .post(middleware.verifyAdmin, admin.createEvent)
router.route("/event/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneEvent)
    .get(admin.findOneEvent)
    .put(middleware.verifyAdmin, admin.updateEvent);
// Đăng ký sự kiện
router.route("/userEvent")
    .get(admin.findAllUserEvent)
    .post(middleware.verifyAdmin, admin.createUserEvent)
router.route("/userEvent/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneUserEvent)
    .get(admin.findOneUserEvent)
    .put(middleware.verifyAdmin, admin.updateUserEvent);


// Đánh giá
router.route("/review")
    .get(admin.findAllReview)
    .post(middleware.verifyAdmin, admin.createReview)
router.route("/review/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneReview)
    .get(admin.findOneReview)
    .put(middleware.verifyAdmin, admin.updateReview);
router.route("/review/find")
    .post(admin.findOneReview)

// Dịch vụ
router.route("/service")
    .get(admin.findAllService)
    .post(middleware.verifyAdmin, admin.createService)
router.route("/service/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneService)
    .get(admin.findOneService)
    .put(middleware.verifyAdmin, admin.updateService);


// Loại sân
router.route("/sportType")
    .get(admin.findAllSportType)
    .post(middleware.verifyAdmin, upload.fields([{ name: 'hinhAnh', maxCount: 10 }, { name: 'hinhAnhDaiDien', maxCount: 1 }]), admin.createSportType)
router.route("/sportType/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneSportType)
    .get(admin.findOneSportType)
    .put(middleware.verifyAdmin, upload.fields([{ name: 'hinhAnh' }, { name: 'hinhAnhDaiDien' }]), admin.updateSportType);
router.route("/sportType/image/:id")
    .delete(middleware.verifyAdmin, admin.deleteImageSportType)

// liên hệ
router.route("/contact")
    .get(admin.findAllContact)
    .post(middleware.verifyAdmin, admin.createContact)
router.route("/contact/:id")
    .delete(middleware.verifyAdmin, admin.deleteOneContact)
    .get(admin.findOneContact)
    .put(middleware.verifyAdmin, admin.updateContact)

module.exports = router;