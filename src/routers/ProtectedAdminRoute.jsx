/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { isTokenExpired, clearExpiredToken } from "../service/login/index";

export const ProtectedAdminRoute = ({ children }) => {
  if (clearExpiredToken("admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  const admin = localStorage.getItem("admin");
  const ALLOWED_ROLES = ["ADMIN", "STAFF", "MANAGER", "DELIVERY"];

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!ALLOWED_ROLES.includes(admin)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
