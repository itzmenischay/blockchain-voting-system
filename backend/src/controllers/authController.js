import User from "../models/User.js";
import Admin from "../models/Admin.js";

import { hashPassword, comparePassword } from "../utils/hashPassword.js";

import { generateToken } from "../utils/generateToken.js";

// ==========================================
// USER SIGNUP
// ==========================================
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // generate token
    const token = generateToken(user._id, "user");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          walletAddress: user.walletAddress || null,
        },
      },
    });
  } catch (error) {
    console.error("USER SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// USER LOGIN
// ==========================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(user._id, "user");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          walletAddress: user.walletAddress || null,
        },
      },
    });
  } catch (error) {
    console.error("USER LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADMIN SIGNUP
// ==========================================
export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // generate token
    const token = generateToken(admin._id, "admin");

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          profilePic: admin.profilePic,
        },
      },
    });
  } catch (error) {
    console.error("ADMIN SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADMIN LOGIN
// ==========================================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(admin._id, "admin");

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          profilePic: admin.profilePic,
        },
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const validateWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // if user already has another wallet
    if (
      user.walletAddress &&
      user.walletAddress !== walletAddress.toLowerCase()
    ) {
      return res.status(401).json({
        success: false,
        message: "This account is linked to another wallet",
      });
    }

    // first time linking
    if (!user.walletAddress) {
      user.walletAddress = walletAddress.toLowerCase();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "wallet validated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
