import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash } = req.body;
    const vote = await Vote.create(voteHash);
    res.json({ success: true, vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
