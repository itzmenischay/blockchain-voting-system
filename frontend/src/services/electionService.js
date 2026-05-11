import API from "./api";

/* GET ALL PUBLIC ELECTIONS */
export const getAllPublicElections = async () => {
  const res = await API.get("/v1/elections");

  return res.data;
};

/* GET ELECTION BY ID */
export const getElectionById = async (electionId) => {
  const res = await API.get(`/v1/elections/${electionId}`);

  return res.data;
};
