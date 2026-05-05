import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
} from "../controllers/authController.js";

const router = express.Router();

// User
router.post("/user/signup", signupUser);
router.post("/user/login", loginUser);

// Admin
router.post("/admin/signup", signupAdmin);
router.post("/admin/login", loginAdmin);

export default router;
