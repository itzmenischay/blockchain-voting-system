import express from "express";
import { getMyVotes, submitVote } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";
import { voteLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/submit", protect, voteLimiter, submitVote);
router.get("/my-votes", protect, getMyVotes);

export default router;
