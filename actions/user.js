import User from "../db/models/User";
import { connectToDatabase } from "../utils/mongodb";
import bcrypt from "bcryptjs";

export const returnUser = async (userId) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).select("-password").lean();
    return user;
  } catch (e) {
    throw e;
  }
};
export const getUserByUsername = async (username) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username }).select("-password").lean();
    return user;
  } catch (e) {
    throw e;
  }
};
export const getUsers = async () => {
  try {
    await connectToDatabase();
    const users = await User.find({}).select("-password").lean();
    return users;
  } catch (e) {
    throw e;
  }
};
export const registerUser = async ({ username, password }) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User Exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();
    return {
      success: true,
      user,
    };
  } catch (e) {
    throw e;
  }
};
export const logInUser = async ({ username, password }) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.validatePassword(password)) {
      throw new Error("Password incorrect");
    }

    return { success: 1, user, error: null };
  } catch (e) {
    return { success: 0, error: e.message, user: null };
  }
};
