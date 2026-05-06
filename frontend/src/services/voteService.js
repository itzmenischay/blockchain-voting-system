import API from "./api";

export const submitVote = async (voteHash, walletAddress, signature, nullifier) => {
  const res = await API.post("/v1/votes", {
    voteHash,
    walletAddress,
    signature,
    nullifier,
  });

  return res.data;
};
