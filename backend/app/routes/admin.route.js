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
    .post(admin.createFacility)
router.route("/facility/:id")
    .delete(admin.deleteOneFacility)
    .get(admin.findOneFacility)
    .put(admin.updateFacility);
   

module.exports = router;