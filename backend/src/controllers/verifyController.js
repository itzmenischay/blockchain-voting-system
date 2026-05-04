import { generateProof } from "../utils/proof.js";

export const verifyVote = async (req, res) => {
  try {
    const { voteHash } = req.params;

    const result = await generateProof(voteHash);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
