const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "student"
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

const user = await User.findOne({
  email: normalizedEmail
}).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = { register, login, getMe };