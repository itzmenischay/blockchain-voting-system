import Vote from "../models/Vote.js";
import { buildMerkleTree } from "../utils/merkle.js";
import { storeOnChain } from "./blockchainService.js";

export const processBatch = async () => {
  try {
    // 1. get unbatched votes
    const votes = await Vote.find({ batchId: null });

    if (votes.length === 0) {
      console.log("No votes to batch");
      return;
    }

    // 2. build merkle root
    const { root } = buildMerkleTree(votes);

    // 3. generate batchId (🔥 moved up)
    const batchId = `batch-${Date.now()}`;

    // 4. update DB first (safe)
    await Vote.updateMany(
      { _id: { $in: votes.map((v) => v._id) } },
      { batchId, status: "batched" }
    );

    console.log("Batch created:");
    console.log("Batch ID:", batchId);
    console.log("Merkle Root:", root);

    // 5. blockchain call (SAFE)
    try {
      await storeOnChain(batchId, root);
    } catch (err) {
      console.error("🔥 Blockchain failed, but system continues");
    }

  } catch (err) {
    console.error("🔥 BATCH PROCESS ERROR:", err);
  }
};