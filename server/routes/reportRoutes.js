const express = require("express");
const { createReport, getReports, updateReportStatus } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", createReport);
router.get("/", protect, adminOnly, getReports);
router.patch("/:id/status", protect, adminOnly, updateReportStatus);

module.exports = router;

