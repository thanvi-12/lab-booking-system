require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
      }

      console.log("Admin account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Administrator",
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();