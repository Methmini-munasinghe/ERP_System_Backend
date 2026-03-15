import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../model/User.js";
import sendEmail from "../util/sendEmail.js";

export const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
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

export const logoutUser = async (token) => {
  return { success: true, message: "Logout successful" };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: `Reset link: http://localhost:3000/reset-password/${resetToken}`,
  });
};

export const resetPasswordService = async (token, password) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return user;
};
