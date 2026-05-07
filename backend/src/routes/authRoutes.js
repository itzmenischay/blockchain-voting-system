import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
  validateWallet,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// User
router.post("/user/signup", authLimiter, signupUser);
router.post("/user/login", authLimiter, loginUser);
router.post("/validate-wallet", protect, validateWallet);

// Admin
router.post("/admin/signup", authLimiter, signupAdmin);
router.post("/admin/login", authLimiter, loginAdmin);

export default router;
