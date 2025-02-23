import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ProtectedUserRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng chức năng này!");
      navigate(-1); 
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};