import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash } = req.body;

    if (!voteHash || typeof voteHash !== "string" || voteHash.length !== 64) {
      return res.status(400).json({ error: "Invalid voteHash" });
    }

    const existing = await Vote.findOne({ voteHash });
    if (existing) {
      return res.status(400).json({ error: "Duplicate vote detected" });
    }

    const vote = await Vote.create({ voteHash });

    res.status(201).json({
      success: true,
      id: vote._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
