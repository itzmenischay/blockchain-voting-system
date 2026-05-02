import crypto from "crypto";

export const generateVoteHash = ({ candidate, walletAddress, nonce }) => {
  const data = `${candidate}-${walletAddress}-${nonce}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};
