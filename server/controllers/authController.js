const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  isBlocked: user.isBlocked
});

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = "donor",
      bloodGroup,
      age,
      location,
      lastDonationDate,
      availabilityStatus = true
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone, role });

    let donor = null;
    if (role === "donor") {
      donor = await Donor.create({
        userId: user._id,
        name,
        bloodGroup,
        phone,
        location,
        age,
        lastDonationDate: lastDonationDate || null,
        availabilityStatus
      });
    }

    res.status(201).json({ token: createToken(user), user: publicUser(user), donor });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (user.isBlocked) return res.status(403).json({ message: "Account is blocked" });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ message: "Invalid email or password" });

    const donor = user.role === "donor" ? await Donor.findOne({ userId: user._id }) : null;
    res.json({ token: createToken(user), user: publicUser(user), donor });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const getProfile = async (req, res) => {
  const donor = req.user.role === "donor" ? await Donor.findOne({ userId: req.user._id }) : null;
  res.json({ user: req.user, donor });
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();

    if (req.user.role === "donor") {
      await Donor.findOneAndUpdate(
        { userId: req.user._id },
        {
          name: req.body.name || req.user.name,
          phone: req.body.phone || req.user.phone,
          location: req.body.location,
          age: req.body.age,
          lastDonationDate: req.body.lastDonationDate
        },
        { new: true }
      );
    }

    const donor = req.user.role === "donor" ? await Donor.findOne({ userId: req.user._id }) : null;
    res.json({ user: publicUser(req.user), donor });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
