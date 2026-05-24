const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const authUsers = [
  {
    name: "Kerala Blood Connect Admin",
    email: "admin@lifedrop.com",
    password: "admin123",
    phone: "9999999999",
    role: "admin"
  },
  {
    name: "Metro Medical Centre",
    email: "hospital@lifedrop.com",
    password: "hospital123",
    phone: "9898989898",
    role: "hospital"
  }
];

const seedAuthUsers = async () => {
  await connectDB();

  for (const user of authUsers) {
    const password = await bcrypt.hash(user.password, 10);
    await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name: user.name,
          password,
          phone: user.phone,
          role: user.role,
          isVerified: true,
          isBlocked: false
        }
      },
      { upsert: true, runValidators: true }
    );
    console.log(`Seeded ${user.role} login: ${user.email} / ${user.password}`);
  }
};

seedAuthUsers()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(`Auth user seed failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  });
