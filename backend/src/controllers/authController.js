import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

// User signup
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      profilePic,
    });

    const token = generateToken(user._id, "user");
    res.status(201).json({
      success: true,
      message: "User created",
      data: { token, user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, "user");

    res.json({
      success: true,
      data: { token, user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin signup
export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashed = await hashPassword(password);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
      profilePic,
    });

    const token = generateToken(admin._id, "admin");

    res.status(201).json({
      success: true,
      message: "Admin created",
      data: { token, admin },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.fineOne({ email });
    if (!admin) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin._id, "admin");

    res.json({
      success: true,
      data: { token, admin },
    });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
