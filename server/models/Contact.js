const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["New", "Read", "Closed"], default: "New" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);

