import express from "express";

import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  addCandidate,
  removeCandidate,
  getElectionResults,
  getActiveElection,
  getPublicElections,
} from "../controllers/electionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- PUBLIC ---------- */

// active election
router.get("/active/current", getActiveElection);

// election results
router.get("/:id/results", getElectionResults);

/* ---------- ADMIN ---------- */

// create
router.post("/", protect, adminOnly, createElection);

// get all
router.get("/admin/all", protect, adminOnly, getAllElections);

// add candidate
router.post("/:id/candidates", protect, adminOnly, addCandidate);

// remove candidate
router.delete(
  "/:id/candidates/:candidateName",
  protect,
  adminOnly,
  removeCandidate,
);

// update
router.put("/:id", protect, adminOnly, updateElection);

// delete
router.delete("/:id", protect, adminOnly, deleteElection);

/* ---------- DYNAMIC LAST ---------- */

// election
router.get("/", getPublicElections);
router.get("/active", getActiveElection);
router.get("/:id", getElectionById);

export default router;
