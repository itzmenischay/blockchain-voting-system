import express from "express";
import { getMyVotes, submitVote } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitVote);
router.get("/my-votes", protect, getMyVotes);

export default router;
