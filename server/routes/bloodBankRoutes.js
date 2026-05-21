const express = require("express");
const {
  createBloodBank,
  getBloodBanks,
  updateBloodBank,
  deleteBloodBank
} = require("../controllers/bloodBankController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createBloodBank);
router.get("/", getBloodBanks);
router.put("/:id", protect, adminOnly, updateBloodBank);
router.delete("/:id", protect, adminOnly, deleteBloodBank);

module.exports = router;

