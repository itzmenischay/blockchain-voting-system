import API from "./api";

export const submitVote = async (voteHash, walletAddress, signature) => {
  const res = await API.post("/votes", {
    voteHash,
    walletAddress,
    signature,
  });

  return res.data;
};
