const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedType: {
      type: String,
      enum: ["donor", "bloodRequest", "user"],
      required: true
    },
    reportedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true, trim: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Open", "Reviewed", "Dismissed"], default: "Open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);

