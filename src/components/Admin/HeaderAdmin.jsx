import React from "react";
import { Layout, Button, Avatar, Dropdown, Space, message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { logout } from "../../service/auth";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderAdmin = ({ collapsed, toggleCollapsed, adminUser }) => {
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await logout(token);

      if (!response.error) {
        localStorage.clear();
        message.success("Logged out successfully");
        navigate("/admin/login");
      } else {
        message.error(response.message || "Logout failed");
      }
    } catch (error) {
      message.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  const dropdownItems = {
    items: [
      {
        key: "2",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        onClick: onLogout,
        danger: true,
      },
    ],
  };

  return (
    <Header
      style={{
        padding: 0,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      <div style={{ paddingRight: 24 }}>
        <Dropdown menu={dropdownItems} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <span style={{ color: "#000" }}>{adminUser || "Admin"}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderAdmin;
