import { ethers } from "ethers";
import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash, walletAddress, signature, nullifier } = req.body;

    if (!voteHash || !walletAddress || !signature || !nullifier) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = `Vote:${voteHash}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // check double voting (pre-check)
    const existingNullifier = await Vote.findOne({ nullifier });
    if (existingNullifier) {
      return res.status(400).json({ error: "User already voted" });
    }

    // check duplicate hash
    const existing = await Vote.findOne({ voteHash });
    if (existing) {
      return res.status(400).json({ error: "Duplicate vote detected" });
    }

    try {
      const vote = await Vote.create({
        voteHash,
        nullifier,
      });

      return res.status(201).json({
        success: true,
        message: "Vote submitted successfully",
        data: {
          id: vote._id,
          voteHash,
          status: "pending",
        },
      });
    } catch (err) {
      // 🔥 HANDLE DUPLICATE KEY ERROR
      if (err.code === 11000) {
        return res.status(400).json({ error: "User already voted" });
      }

      throw err; // rethrow unknown errors
    }
  } catch (error) {
    console.error("🔥 CONTROLLER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
