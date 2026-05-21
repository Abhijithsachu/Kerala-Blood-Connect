const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    bloodGroupNeeded: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    unitsRequired: { type: Number, required: true, min: 1 },
    hospitalName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    urgencyLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Medium"
    },
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active"
    },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

