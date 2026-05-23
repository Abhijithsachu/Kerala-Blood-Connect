const BloodRequest = require("../models/BloodRequest");
const { validateBloodRequestInput } = require("../utils/validation");

const buildBloodRequestPayload = (body) => ({
  patientName: String(body.patientName || "").trim(),
  bloodGroupNeeded: body.bloodGroupNeeded,
  unitsRequired: Number(body.unitsRequired),
  hospitalName: String(body.hospitalName || "").trim(),
  location: String(body.location || "").trim(),
  contactNumber: String(body.contactNumber || "").trim(),
  urgencyLevel: body.urgencyLevel || "Medium",
  isPublic: Boolean(body.isPublic)
});

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
    const payload = buildBloodRequestPayload(req.body);
    const validation = validateBloodRequestInput(payload);
    if (!validation.valid) return res.status(400).json({ message: validation.message });

    const request = await BloodRequest.create(payload);
    res.status(201).json({ message: "Blood request saved", request });
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
