import express from "express";
import { getElectionById } from "../controllers/electionController.js";

const router = express.Router();

router.get("/:id", getElectionById);

export default router;
