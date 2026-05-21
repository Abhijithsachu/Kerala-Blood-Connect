const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");
const BloodBank = require("../models/BloodBank");
const Contact = require("../models/Contact");
const Report = require("../models/Report");

const getStats = async (req, res) => {
  const [totalDonors, availableDonors, totalBloodRequests, emergencyRequests, blockedUsers, reports] =
    await Promise.all([
      Donor.countDocuments(),
      Donor.countDocuments({ availabilityStatus: true, isBlocked: false }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ urgencyLevel: "Emergency", isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      Report.countDocuments({ status: "Open" })
    ]);

  res.json({ totalDonors, availableDonors, totalBloodRequests, emergencyRequests, blockedUsers, reports });
};

const toggleUserBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBlocked = req.body.isBlocked ?? !user.isBlocked;
  await user.save();
  res.json({ message: user.isBlocked ? "User blocked" : "User unblocked", user });
};

const toggleDonorBlock = async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  donor.isBlocked = req.body.isBlocked ?? !donor.isBlocked;
  await donor.save();
  await User.findByIdAndUpdate(donor.userId, { isBlocked: donor.isBlocked });
  res.json({ message: donor.isBlocked ? "Donor blocked" : "Donor unblocked", donor });
};

const toggleRequestBlock = async (req, res) => {
  const bloodRequest = await BloodRequest.findById(req.params.id);
  if (!bloodRequest) return res.status(404).json({ message: "Request not found" });
  bloodRequest.isBlocked = req.body.isBlocked ?? !bloodRequest.isBlocked;
  await bloodRequest.save();
  res.json({ message: bloodRequest.isBlocked ? "Request blocked" : "Request unblocked", bloodRequest });
};

const listUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const adminCollections = async (req, res) => {
  const [users, donors, requests, bloodBanks, contacts, reports] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }),
    Donor.find().sort({ createdAt: -1 }),
    BloodRequest.find().sort({ createdAt: -1 }),
    BloodBank.find().sort({ createdAt: -1 }),
    Contact.find().sort({ createdAt: -1 }),
    Report.find().sort({ createdAt: -1 })
  ]);
  res.json({ users, donors, requests, bloodBanks, contacts, reports });
};

module.exports = { getStats, toggleUserBlock, toggleDonorBlock, toggleRequestBlock, listUsers, adminCollections };

