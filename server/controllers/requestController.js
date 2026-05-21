const BloodRequest = require("../models/BloodRequest");

const buildRequestQuery = (query, publicOnly = false) => {
  const filter = { isBlocked: false };
  if (publicOnly) filter.isPublic = true;
  if (query.bloodGroup) filter.bloodGroupNeeded = query.bloodGroup;
  if (query.location) filter.location = { $regex: query.location, $options: "i" };
  if (query.urgencyLevel) filter.urgencyLevel = query.urgencyLevel;
  if (query.status) filter.status = query.status;
  return filter;
};

const createRequest = async (req, res) => {
  try {
    const request = await BloodRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Could not create blood request", error: error.message });
  }
};

const getRequests = async (req, res) => {
  const filter = req.user?.role === "admin" && req.query.includeBlocked === "true" ? {} : buildRequestQuery(req.query);
  const requests = await BloodRequest.find(filter).sort({ createdAt: -1 });
  res.json(requests);
};

const getPublicRequests = async (req, res) => {
  const requests = await BloodRequest.find(buildRequestQuery(req.query, true)).sort({
    urgencyLevel: 1,
    createdAt: -1
  });
  res.json(requests);
};

const getRequestById = async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request || request.isBlocked) return res.status(404).json({ message: "Request not found" });
  res.json(request);
};

const updateRequestStatus = async (req, res) => {
  const request = await BloodRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
};

const deleteRequest = async (req, res) => {
  const request = await BloodRequest.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json({ message: "Blood request deleted" });
};

module.exports = { createRequest, getRequests, getPublicRequests, getRequestById, updateRequestStatus, deleteRequest };

