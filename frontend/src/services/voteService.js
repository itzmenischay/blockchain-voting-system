import API from "./api";

export const submitVote = async (voteHash) => {
  const res = await API.post("/votes", {
    voteHash,
  });

  return res.data;
};
