const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Kerala Blood Connect API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/donors", require("./routes/donorRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/blood-banks", require("./routes/bloodBankRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

app.listen(port, () => {
  console.log(`Kerala Blood Connect server running on port ${port}`);
});
