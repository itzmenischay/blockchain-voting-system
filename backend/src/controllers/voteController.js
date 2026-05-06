import { ethers } from "ethers";

import Vote from "../models/Vote.js";
import User from "../models/User.js";

export const submitVote = async (req, res) => {
  try {
    const { voteHash, walletAddress, signature, nullifier } = req.body;

    // authenticated user from JWT middleware
    const userId = req.user.id;

    // validate fields
    if (!voteHash || !walletAddress || !signature || !nullifier) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // find authenticated user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // WALLET BINDING
    // ==========================================

    // bind wallet if not already linked
    if (!user.walletAddress) {
      user.walletAddress = walletAddress;
      await user.save();
    }

    // prevent wallet spoofing
    if (user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Wallet mismatch",
      });
    }

    // ==========================================
    // SIGNATURE VERIFICATION
    // ==========================================

    const message = `Vote:${voteHash}`;

    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ==========================================
    // DOUBLE VOTE PREVENTION
    // ==========================================

    // nullifier check
    const existingNullifier = await Vote.findOne({ nullifier });

    if (existingNullifier) {
      return res.status(400).json({
        success: false,
        message: "User already voted",
      });
    }

    // duplicate vote hash check
    const existingVote = await Vote.findOne({
      voteHash,
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "Duplicate vote detected",
      });
    }

    // ==========================================
    // CREATE VOTE
    // ==========================================

    try {
      const vote = await Vote.create({
        voteHash,
        nullifier,
        userId,
        walletAddress,
      });

      return res.status(201).json({
        success: true,
        message: "Vote submitted successfully",
        data: {
          id: vote._id,
          voteHash,
          walletAddress,
          status: "pending",
        },
      });
    } catch (err) {
      // duplicate key error
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "User already voted",
        });
      }

      throw err;
    }
  } catch (error) {
    console.error("🔥 VOTE CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.find({
      userId: req.user.id,
    }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: votes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
