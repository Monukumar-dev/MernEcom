const express = require("express");
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

const {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} = require("../controllers/bannerController");

const router = express.Router();

// Public Route
router.get("/", getAllBanners);

// Protected Routes
router.post("/create", auth, upload, createBanner);
router.put("/update/:id", auth, upload, updateBanner);
router.delete("/delete/:id", auth,  deleteBanner);
router.put("/toggle-status/:id", auth, toggleBannerStatus);

module.exports = router;
