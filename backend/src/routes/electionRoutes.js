import express from "express";

import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
} from "../controllers/electionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/:id", getElectionById);

// admin
router.post("/", protect, adminOnly, createElection);

router.get("/admin/all", protect, adminOnly, getAllElections);

router.put("/:id", protect, adminOnly, updateElection);

router.delete("/:id", protect, adminOnly, deleteElection);

export default router;
