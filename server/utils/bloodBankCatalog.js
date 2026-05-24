const BloodBank = require("../models/BloodBank");
const { buildOfficialBloodBanks } = require("../seed/seed");

const normalize = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const bloodBankKey = (bank) => [bank.name, bank.address, bank.city].map(normalize).join("|");

const slug = (value) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const buildStaticBloodBanks = () =>
  buildOfficialBloodBanks().map((bank, index) => ({
    ...bank,
    _id: `static-${index + 1}-${slug(`${bank.name}-${bank.city}`)}`,
    isStatic: true,
    source: "static"
  }));

const toPlainBloodBank = (bank) => {
  const plain = typeof bank.toObject === "function" ? bank.toObject() : bank;
  return {
    ...plain,
    _id: String(plain._id),
    isStatic: false,
    source: "database"
  };
};

const matchesText = (value, search) => normalize(value).includes(normalize(search));

const filterBloodBanks = (banks, query = {}) =>
  banks.filter((bank) => {
    if (query.city && !matchesText(bank.city, query.city)) return false;
    if (query.location && !matchesText(bank.city, query.location) && !matchesText(bank.address, query.location)) return false;
    return true;
  });

const sortBloodBanks = (banks) =>
  banks.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));

const getMergedBloodBanks = async ({ query = {}, limit = 0 } = {}) => {
  const merged = new Map();
  buildStaticBloodBanks().forEach((bank) => merged.set(bloodBankKey(bank), bank));

  const databaseBanks = await BloodBank.find().sort({ city: 1, name: 1 });
  databaseBanks.map(toPlainBloodBank).forEach((bank) => merged.set(bloodBankKey(bank), bank));

  const filtered = sortBloodBanks(filterBloodBanks(Array.from(merged.values()), query));
  return limit ? filtered.slice(0, limit) : filtered;
};

module.exports = { getMergedBloodBanks };
