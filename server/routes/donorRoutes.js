const express = require("express");
const {
  createDonor,
  getDonors,
  getDonorById,
  updateDonor,
  updateAvailability,
  deleteDonor
} = require("../controllers/donorController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createDonor);
router.get("/", getDonors);
router.get("/:id", getDonorById);
router.put("/:id", protect, updateDonor);
router.patch("/:id/availability", protect, updateAvailability);
router.delete("/:id", protect, adminOnly, deleteDonor);

module.exports = router;

