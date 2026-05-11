import API from "./api";

export const adminSignup = async (formData) => {
  const res = await API.post("/auth/admin/signup", formData);

  return res.data;
};

export const adminLogin = async (credentials) => {
  const res = await API.post("/auth/admin/login", credentials);

  return res.data;
};
