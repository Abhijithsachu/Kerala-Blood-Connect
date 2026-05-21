const express = require("express");
const {
  getStats,
  toggleUserBlock,
  toggleDonorBlock,
  toggleRequestBlock,
  listUsers,
  adminCollections
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect, adminOnly);
router.get("/stats", getStats);
router.get("/users", listUsers);
router.get("/collections", adminCollections);
router.patch("/users/:id/block", toggleUserBlock);
router.patch("/donors/:id/block", toggleDonorBlock);
router.patch("/requests/:id/block", toggleRequestBlock);

module.exports = router;

