const express = require("express");
const {
  createRequest,
  getRequests,
  getPublicRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/public", getPublicRequests);
router.get("/:id", getRequestById);
router.patch("/:id/status", protect, adminOnly, updateRequestStatus);
router.delete("/:id", protect, adminOnly, deleteRequest);

module.exports = router;

