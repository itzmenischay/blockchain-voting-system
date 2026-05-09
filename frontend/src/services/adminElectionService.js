import API from "./api";

/* CREATE ELECTION */
export const createElection = async (payload) => {
  const res = await API.post("/v1/elections", payload);

  return res.data;
};

/* GET ALL ELECTIONS */
export const getAllElections = async (page = 1, limit = 10) => {
  const res = await API.get(
    `/v1/elections/admin/all?page=${page}&limit=${limit}`,
  );

  return res.data;
};

/* GET ELECTION */
export const getElectionById = async (id) => {
  const res = await API.get(`/v1/elections/${id}`);

  return res.data;
};

/* UPDATE ELECTION */
export const updateElection = async (id, payload) => {
  const res = await API.put(`/v1/elections/${id}`, payload);

  return res.data;
};

/* DELETE ELECTION */
export const deleteElection = async (id) => {
  const res = await API.delete(`/v1/elections/${id}`);

  return res.data;
};
