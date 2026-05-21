const Donor = require("../models/Donor");

const buildDonorQuery = (query) => {
  const filter = { isBlocked: false };
  if (query.bloodGroup) filter.bloodGroup = query.bloodGroup;
  if (query.location) filter.location = { $regex: query.location, $options: "i" };
  if (query.availableOnly === "true") filter.availabilityStatus = true;
  return filter;
};

const createDonor = async (req, res) => {
  try {
    const donor = await Donor.create({ ...req.body, userId: req.user._id });
    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: "Could not create donor", error: error.message });
  }
};

const getDonors = async (req, res) => {
  const includeBlocked = req.user?.role === "admin" && req.query.includeBlocked === "true";
  const filter = includeBlocked ? {} : buildDonorQuery(req.query);
  const donors = await Donor.find(filter).sort({ availabilityStatus: -1, createdAt: -1 });
  res.json(donors);
};

const getDonorById = async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  if (!donor || donor.isBlocked) return res.status(404).json({ message: "Donor not found" });
  res.json(donor);
};

const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const ownsProfile = donor.userId.toString() === req.user._id.toString();
    if (!ownsProfile && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to update this donor" });
    }

    Object.assign(donor, req.body);
    await donor.save();
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: "Could not update donor", error: error.message });
  }
};

const updateAvailability = async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  if (!donor) return res.status(404).json({ message: "Donor not found" });

  const ownsProfile = donor.userId.toString() === req.user._id.toString();
  if (!ownsProfile && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed to update availability" });
  }

  donor.availabilityStatus = Boolean(req.body.availabilityStatus);
  await donor.save();
  res.json(donor);
};

const deleteDonor = async (req, res) => {
  const donor = await Donor.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json({ message: "Donor deleted" });
};

module.exports = { createDonor, getDonors, getDonorById, updateDonor, updateAvailability, deleteDonor };

