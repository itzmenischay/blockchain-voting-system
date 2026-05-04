import Vote from "../models/Vote.js";
import { buildMerkleTree } from "../utils/merkle.js";

export const processBatch = async () => {
  // get unbatched votes
  const votes = await Vote.find({ batchId: null });

  if (votes.length === 0) {
    console.log("No votes to batch");
    return;
  }

  const { root } = buildMerkleTree(votes);

  const batchId = `batch-${Date.now()}`;

  // update votes with batchId
  await Vote.updateMany({ _id: { $in: votes.map((v) => v._id) } }, { batchId });

  console.log("Batch created:");
  console.log("Batch ID: ", batchId);
  console.log("Merkle Root: ", root);
};
