const SiteSettings = require("../models/SiteSettings");
const { validateSiteSettingsInput } = require("../utils/validation");

const SETTINGS_KEY = "public-contact";

const defaultSettings = {
  emergencyPhone: "",
  whatsappNumber: "",
  email: "",
  address: "",
  emergencyNote: ""
};

const cleanSettings = (settings = {}) => ({
  emergencyPhone: settings.emergencyPhone || "",
  whatsappNumber: settings.whatsappNumber || "",
  email: settings.email || "",
  address: settings.address || "",
  emergencyNote: settings.emergencyNote || ""
});

const getSettings = async (req, res) => {
  const settings = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();
  res.json(settings ? cleanSettings(settings) : defaultSettings);
};

const updateSettings = async (req, res) => {
  const validation = validateSiteSettingsInput(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  const payload = cleanSettings({
    emergencyPhone: String(req.body.emergencyPhone || "").trim(),
    whatsappNumber: String(req.body.whatsappNumber || "").trim(),
    email: String(req.body.email || "").trim().toLowerCase(),
    address: String(req.body.address || "").trim(),
    emergencyNote: String(req.body.emergencyNote || "").trim()
  });

  const settings = await SiteSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $set: { ...payload, key: SETTINGS_KEY } },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  res.json(cleanSettings(settings));
};

module.exports = { getSettings, updateSettings };
