const BloodBank = require("../models/BloodBank");
const { validateBloodBankInput } = require("../utils/validation");

const createBloodBank = async (req, res) => {
  try {
    const validation = validateBloodBankInput(req.body);
    if (!validation.valid) return res.status(400).json({ message: validation.message });

    const bank = await BloodBank.create(req.body);
    res.status(201).json(bank);
  } catch (error) {
    res.status(500).json({ message: "Could not create blood bank", error: error.message });
  }
};

const getBloodBanks = async (req, res) => {
  const filter = {};
  if (req.query.city) filter.city = { $regex: req.query.city, $options: "i" };
  if (req.query.location) {
    filter.$or = [
      { city: { $regex: req.query.location, $options: "i" } },
      { address: { $regex: req.query.location, $options: "i" } }
    ];
  }
  const maxLimit = Number(process.env.BLOOD_BANK_MAX_LIMIT) || 50;
  const limit = Math.min(Number(req.query.limit) || 0, maxLimit);
  const query = BloodBank.find(filter).sort({ city: 1, name: 1 });
  if (limit) query.limit(limit);
  const banks = await query;
  res.json(banks);
};

const updateBloodBank = async (req, res) => {
  const validation = validateBloodBankInput(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  const bank = await BloodBank.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!bank) return res.status(404).json({ message: "Blood bank not found" });
  res.json(bank);
};

const deleteBloodBank = async (req, res) => {
  const bank = await BloodBank.findByIdAndDelete(req.params.id);
  if (!bank) return res.status(404).json({ message: "Blood bank not found" });
  res.json({ message: "Blood bank deleted" });
};

module.exports = { createBloodBank, getBloodBanks, updateBloodBank, deleteBloodBank };
