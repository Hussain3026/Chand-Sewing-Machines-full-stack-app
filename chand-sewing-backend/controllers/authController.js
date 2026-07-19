const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase() });
      if (taken) {
        return res.status(409).json({ message: "That email is already in use." });
      }
      user.email = email.toLowerCase();
    }
    if (name) user.name = name;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/auth/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    user.password = newPassword; // hashed automatically by the pre-save hook
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/auth/address
const saveAddress = async (req, res, next) => {
  try {
    const { fullName, phone, line1, city, state, pincode } = req.body;
    const user = await User.findById(req.user._id);
    user.address = { fullName, phone, line1, city, state, pincode };
    await user.save();
    res.json({ address: user.address });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, saveAddress };
