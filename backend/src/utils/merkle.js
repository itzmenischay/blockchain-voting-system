import { MerkleTree } from "merkletreejs";
import CryptoJS from "crypto-js";

const hash = (data) => CryptoJS.SHA256(data).toString();

export const buildMerkleTree = (votes) => {
  const leaves = votes.map((v) => hash(v.voteHash));

  const tree = new MerkleTree(leaves, hash, {
    sortPairs: true,
  });

  const root = tree.getRoot().toString("hex");

  return {
    tree,
    root,
    leaves,
  };
};
