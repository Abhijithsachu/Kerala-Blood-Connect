const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    openingHours: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodBank", bloodBankSchema);

