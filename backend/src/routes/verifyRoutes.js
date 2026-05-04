import express from 'express'
import { verifyVote } from '../controllers/verifyController.js'

const router = express.Router();

router.get("/:voteHash", verifyVote)

export default router;