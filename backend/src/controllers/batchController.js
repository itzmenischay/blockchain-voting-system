import Vote from "../models/Vote.js";

export const getBatches = async (req, res) => {
  try {
    const votes = await Vote.find({ batchId: { $ne: null } }).sort({
      timestamp: -1,
    });

    const grouped = {};

    votes.forEach((vote) => {
      if (!grouped[vote.batchId]) {
        grouped[vote.batchId] = {
          batchId: vote.batchId,
          votes: [],
          timestamp: vote.timestamp,
          voteCount: 0,
        };
      }

      grouped[vote.batchId].votes.push(vote.voteHash);
      grouped[vote.batchId].voteCount++;
    });

    const result = Object.values(grouped);

    res.status(200).json({
      success: true,
      message: "Batches fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
