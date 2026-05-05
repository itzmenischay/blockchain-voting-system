import Vote from "../models/Vote.js";
import { generateProof } from "../utils/proof.js";

export const verifyVote = async (req, res) => {
  try {
    const { voteHash } = req.params;

    const vote = await Vote.findOne({ voteHash });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    if (!vote.batchId) {
      return res.json({
        success: true,
        data: {
          status: "pending",
        },
      });
    }

    return res.json({
      success: true,
      data: {
        status: "verified",
        batchId: vote.batchId,
        root: vote.merkleRoot || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
