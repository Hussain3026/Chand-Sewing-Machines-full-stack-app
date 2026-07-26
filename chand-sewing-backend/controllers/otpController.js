const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

const OTP_EXPIRY_MINUTES = 10;

const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const otpTemplate = (otp, name) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #1b2a4a;">Chand Sewing Machines</h2>
    <p style="color: #333; font-size: 15px;">Hi ${name},</p>
    <p style="color: #333; font-size: 15px;">Your verification code is:</p>
    <div style="background: #f5f6fa; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
      <span style="font-size: 32px; font-weight: 800; color: #8e0aa0; letter-spacing: 6px;">${otp}</span>
    </div>
    <p style="color: #6b7280; font-size: 13px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes. If you didn't request this, please ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
    <p style="color: #6b7280; font-size: 12px;">Chand Sewing Machines — Your trusted sewing partner</p>
  </div>
`;

// @route POST /api/otp/send-email
const sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`\n[OTP] === RESEND OTP for ${user.email}: ${otp} ===\n`);

    await sendEmail({
      to: user.email,
      subject: "Verify your email — Chand Sewing Machines",
      html: otpTemplate(otp, user.name),
    });

    res.json({ message: "OTP sent to your email.", expiresIn: OTP_EXPIRY_MINUTES });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/otp/verify
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP request found. Please request a new one." });
    }

    if (new Date() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: "Email verified successfully.", token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendEmailOTP, verifyOTP };
