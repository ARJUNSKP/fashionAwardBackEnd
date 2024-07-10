const express = require("express");
const otpController = require("../controller/otpControllers");
const categoryController = require("../controller/categoryController");
const candidatesController = require("../controller/candidatesController");
const { multerParser } = require("../middleware/imageMulter");

const router = express.Router();

router.post("/api/otp-generator", otpController.otpGenerator);
router.post("/api/otp-verify-otp", otpController.otpValidation);

// ******* category *********

router.post(
  "/api/category-create",
  multerParser.single("image"),
  categoryController.newCategory
);
router.delete("/api/delete-category", categoryController.deleteCategory);

// ********candidate********************************************
router.post(
  "/api/create-candidate",
  multerParser.single("image"),
  candidatesController.createCandidate
);
router.delete("/api/delete-candidate", candidatesController.deleteCandidate);

module.exports = router;
