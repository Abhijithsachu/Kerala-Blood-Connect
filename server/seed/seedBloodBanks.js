const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const BloodBank = require("../models/BloodBank");
const { buildOfficialBloodBanks } = require("./seed");

dotenv.config();

const seedBloodBanks = async () => {
  await connectDB();

  const bloodBanks = buildOfficialBloodBanks();
  const operations = bloodBanks.map((bank) => ({
    updateOne: {
      filter: {
        name: bank.name,
        address: bank.address,
        city: bank.city
      },
      update: { $setOnInsert: bank },
      upsert: true
    }
  }));

  const result = operations.length ? await BloodBank.bulkWrite(operations, { ordered: false }) : {};
  const inserted = result.upsertedCount || 0;
  const existing = bloodBanks.length - inserted;

  console.log(`Official Kerala blood centers checked: ${bloodBanks.length}`);
  console.log(`Inserted missing blood centers: ${inserted}`);
  console.log(`Already present: ${existing}`);
};

seedBloodBanks()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(`Blood bank seed failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  });
