const mongoose = require("mongoose");

const donationRecordSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    hospital: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { _id: false }
);

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    lastDonationDate: { type: Date },
    availabilityStatus: { type: Boolean, default: true },
    donationHistory: [donationRecordSchema],
    badge: { type: String, default: "Life Saver" },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);

