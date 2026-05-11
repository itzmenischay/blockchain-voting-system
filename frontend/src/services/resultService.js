import API from "./api";

export const getElectionResults = async (electionId) => {
  const res = await API.get(`/v1/elections/${electionId}/results`);

  return res.data;
};
