import API from "./api";

export const signupUser = async (formData) => {
  const res = await API.post("/auth/user/signup", formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await API.post("/auth/user/login", formData);
  return res.data;
};

export const signupAdmin = async (formData) => {
  const res = await API.post("/auth/admin/signup", formData);
  return res.data;
};

export const loginAdmin = async (formData) => {
  const res = await API.post("/auth/admin/login", formData);
  return res.data;
};
