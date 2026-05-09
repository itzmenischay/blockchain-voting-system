import React from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
