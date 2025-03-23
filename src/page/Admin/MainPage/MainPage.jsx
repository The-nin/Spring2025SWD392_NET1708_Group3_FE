import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Admin/Sidebar";
import AdminHeader from "../../../components/Admin/HeaderAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Content } = Layout;

const MainPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  // const adminUser = JSON.parse(localStorage.getItem("role"));
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Sidebar
        handleLogout={handleLogout}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
          background: "#001529",
        }}
      >
        <AdminHeader
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          adminUser={role}
        />
        <Content
          style={{
            minHeight: 280,
            background: "#f0f2f5",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
