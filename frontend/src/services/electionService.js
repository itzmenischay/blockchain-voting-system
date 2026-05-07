import API from "./api";

export const getElection = async (
  electionId
) => {

  const res = await API.get(
    `/v1/elections/${electionId}`
  );

  return res.data;
};