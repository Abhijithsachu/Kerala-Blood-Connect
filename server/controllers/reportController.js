const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      reportedBy: req.user?._id || undefined
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Could not create report", error: error.message });
  }
};

const getReports = async (req, res) => {
  const reports = await Report.find().populate("reportedBy", "name email").sort({ createdAt: -1 });
  res.json(reports);
};

const updateReportStatus = async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!report) return res.status(404).json({ message: "Report not found" });
  res.json(report);
};

module.exports = { createReport, getReports, updateReportStatus };

