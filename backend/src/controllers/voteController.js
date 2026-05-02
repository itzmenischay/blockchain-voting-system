import { ethers } from 'ethers'
import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash, walletAddress, signature } = req.body;

    if (!voteHash || !walletAddress || !signature) {
      return res.status(400).json({ error: "Missing fields" });
    }
    
    const message = `Vote:${voteHash}`

    // recover signer
    const recoveredAddress = ethers.verifyMessage(message, signature)

    if(recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({error: "Invalid signature"})
    }

    // duplocate vote check
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
