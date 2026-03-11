import User from "../model/User.js";
import bcrypt from "bcryptjs";

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
  // Invalidate token (for stateless JWT, this is typically done on the client side by deleting the token)
  // For demonstration, we can simply return a success message

  return { success: true, message: "Logout successful" };
};