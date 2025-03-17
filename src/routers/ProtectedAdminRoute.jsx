/* eslint-disable react/prop-types */
// import { Navigate } from "react-router-dom";

// export const ProtectedAdminRoute = ({ children }) => {
//   const admin = localStorage.getItem("admin");
//   const staff = localStorage.getItem("staff");
//   const manager = localStorage.getItem("manager");
//   const delivery = localStorage.getItem("delivery");
//   const expert = localStorage.getItem("expert");

//   const role = [admin, staff, manager, delivery, expert];

//   if (!role) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (!admin) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (admin !== "ADMIN") {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// };

import { Navigate } from "react-router-dom";
import { isTokenExpired, clearExpiredToken } from "../service/login/index";

export const ProtectedAdminRoute = ({ children }) => {
  if (clearExpiredToken("admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  const admin = localStorage.getItem("admin");
  const staff = localStorage.getItem("staff");
  const manager = localStorage.getItem("manager");
  const delivery = localStorage.getItem("delivery");
  const expert = localStorage.getItem("expert");

  // Gộp các role vào một mảng và lọc bỏ các giá trị null/undefined
  const roles = [admin, staff, manager, delivery, expert].filter(Boolean);

  // Nếu không có role nào hợp lệ (mảng rỗng), chuyển về login
  if (roles.length === 0) {
    return <Navigate to="/admin/login" replace />;
  }

  // Kiểm tra xem có ít nhất một role hợp lệ không
  const validRoles = ["ADMIN", "STAFF", "MANAGER", "DELIVERY", "EXPERT"];
  const hasValidRole = roles.some((role) => validRoles.includes(role));

  if (!hasValidRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
