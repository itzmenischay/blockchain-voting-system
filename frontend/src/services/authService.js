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

export const validateWallet = async (walletAddress, signature) => {
  const res = await API.post("/auth/validate-wallet", {
    walletAddress,
    signature,
  });

  return res.data;
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  role,
}) => {
  const endpoint =
    role === "admin"
      ? "/auth/admin/change-password"
      : "/auth/user/change-password";

  const res = await API.patch(endpoint, {
    currentPassword,
    newPassword,
  });

  return res.data;
};
