/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (admin !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
