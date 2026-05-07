import Vote from "../models/Vote.js";
import Batch from "../models/Batch.js";
import { buildMerkleTree } from "../utils/merkle.js";
import { storeOnChain } from "./blockchainService.js";

export const processBatch = async () => {
  try {
    // Get only pending votes
    const votes = await Vote.find({
      status: "pending",
      batchId: null,
    }).sort({ createdAt: 1 });

    if (votes.length === 0) {
      console.log("No votes to batch");
      return;
    }

    // Lock votes temporarily
    await Vote.updateMany(
      {
        _id: { $in: votes.map((v) => v._id) },
      },
      {
        status: "processing",
      },
    );

    // Generate merkle tree
    const { root } = buildMerkleTree(votes);

    // Generate batch ID
    const batchId = `batch-${Date.now()}`;

    // Create batch record
    const batch = await Batch.create({
      batchId,
      merkleRoot: root,
      voteCount: votes.length,
      status: "processing",
    });

    let transactionHash = null;

    try {
      // Store on blockchain
      const tx = await storeOnChain(batchId, root);

      // if blockchain service returns tx hash
      transactionHash = tx?.hash || null;

      // Update batch as confirmed
      batch.status = "confirmed";
      batch.transactionHash = transactionHash;

      await batch.save();

      // Update votes
      await Vote.updateMany(
        {
          _id: { $in: votes.map((v) => v._id) },
        },
        {
          batchId,
          merkleRoot: root,
          transactionHash,
          status: "batched",
        },
      );

      console.log("Batch processed successfully");
      console.log("Batch ID:", batchId);
      console.log("Merkle Root:", root);
    } catch (blockchainErr) {
      console.error("Blockchain storage failed:", blockchainErr);

      // mark batch failed
      batch.status = "failed";
      await batch.save();

      // rollback votes
      await Vote.updateMany(
        {
          _id: { $in: votes.map((v) => v._id) },
        },
        {
          status: "failed",
        },
      );
    }
  } catch (err) {
    console.error("BATCH PROCESS ERROR:", err);
  }
};
