import React from "react";
import { Layout, Button, Avatar, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderAdmin = ({
  collapsed,
  toggleCollapsed,
  adminUser,
  handleLogout,
}) => {
  const dropdownItems = {
    items: [
      {
        key: "1",
        label: "Settings",
        icon: <SettingOutlined />,
      },
      {
        key: "2",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
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
            <span style={{ color: "#000" }}>
              {adminUser?.username || "Admin"}
            </span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderAdmin;
