import bcrypt from "bcryptjs";
import User from "../model/User.js";
import sendEmail from "../util/sendEmail.js";

export const registerUser = async (data) => {
  const { name, email, phone, password, confirmPassword, role } = data;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
  user.isResetOtpVerified = false;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
  });
};

export const verifyResetOtpService = async (email, otp) => {
  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  user.isResetOtpVerified = true;
  await user.save();

  return true;
};

export const resetPasswordService = async (email, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isResetOtpVerified) {
    throw new Error("OTP verification required");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpire = undefined;
  user.isResetOtpVerified = false;

  await user.save();

  return user;
};