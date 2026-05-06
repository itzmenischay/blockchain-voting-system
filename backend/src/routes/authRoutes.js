import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
  validateWallet,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User
router.post("/user/signup", signupUser);
router.post("/user/login", loginUser);
router.post("/validate-wallet", protect, validateWallet);

// Admin
router.post("/admin/signup", signupAdmin);
router.post("/admin/login", loginAdmin);

export default router;
