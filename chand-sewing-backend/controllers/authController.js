const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const otpTemplate = (otp, name) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #1b2a4a;">Chand Sewing Machines</h2>
    <p style="color: #333; font-size: 15px;">Hi ${name},</p>
    <p style="color: #333; font-size: 15px;">Your verification code is:</p>
    <div style="background: #f5f6fa; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
      <span style="font-size: 32px; font-weight: 800; color: #8e0aa0; letter-spacing: 6px;">${otp}</span>
    </div>
    <p style="color: #6b7280; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
    <p style="color: #6b7280; font-size: 12px;">Chand Sewing Machines — Your trusted sewing partner</p>
  </div>
`;

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

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n[OTP] === REGISTER OTP for ${user.email}: ${otp} ===\n`);

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email — Chand Sewing Machines",
        html: otpTemplate(otp, user.name),
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr.message);
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: user.toSafeObject(),
      requiresVerification: !user.isEmailVerified,
    });
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

    if (!user.isEmailVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      console.log(`\n[OTP] === LOGIN OTP for ${user.email}: ${otp} ===\n`);

      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email — Chand Sewing Machines",
          html: otpTemplate(otp, user.name),
        });
      } catch (emailErr) {
        console.error("Failed to send verification email:", emailErr.message);
      }

      return res.json({
        requiresVerification: true,
        email: user.email,
        message: "Please verify your email. An OTP has been sent.",
      });
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
    const { fullName, phone, line1, city, state, pincode, lat, lng } = req.body;
    const user = await User.findById(req.user._id);
    user.address = { fullName, phone, line1, city, state, pincode, lat, lng };
    await user.save();
    res.json({ address: user.address });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, saveAddress };
