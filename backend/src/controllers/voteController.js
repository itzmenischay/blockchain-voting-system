import { ethers } from "ethers";
import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash, walletAddress, signature, nullifier } = req.body;

    if (!voteHash || !walletAddress || !signature || !nullifier) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = `Vote:${voteHash}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // check double voting
    const existingNullifier = await Vote.findOne({ nullifier });
    if (existingNullifier) {
      return res.status(400).json({ error: "User already voted" });
    }

    // optional: duplicate hash check
    const existing = await Vote.findOne({ voteHash });
    if (existing) {
      return res.status(400).json({ error: "Duplicate vote detected" });
    }

    const vote = await Vote.create({
      voteHash,
      nullifier,
    });

    res.status(201).json({
      success: true,
      id: vote._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
