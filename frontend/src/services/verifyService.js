import API from "./api.js";

export const verifyVote = async (voteHash) => {
  const res = await API.get(`verify/${voteHash}`);
  return res.data;
};
