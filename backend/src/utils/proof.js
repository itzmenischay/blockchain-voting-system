import { buildMerkleTree } from "./merkle.js";
import Vote from "../models/Vote.js";
import CryptoJS from "crypto-js";

const hash = (data) => CryptoJS.SHA256(data).toString();

export const generateProof = async (voteHash) => {
  const vote = await Vote.findOne({ voteHash });

  if (!vote || !vote.batchId) {
    throw new Error("Vote not found or not batched");
  }

  const batchVotes = await Vote.find({ batchId: vote.batchId });

  const { tree } = buildMerkleTree(batchVotes);

  const leaf = hash(voteHash);
  const proof = tree.getProof(leaf).map((p) => ({
    position: p.position,
    data: p.data.toString("hex"),
  }));
  const root = tree.getRoot().toString("hex");

  return {
    proof,
    root,
    leaf,
  };
};
