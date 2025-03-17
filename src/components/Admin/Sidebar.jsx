import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  CopyrightOutlined,
  FileOutlined,
  OrderedListOutlined,
  CustomerServiceOutlined,
  ReadOutlined, // 📖 New icon for Blog Management
  QuestionCircleOutlined, // ❓ New icon for Quiz Management
  GiftOutlined,
  SolutionOutlined, // 🎁 Icon for Vouchers
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: "User Management",
    },
    {
      key: "/admin/product",
      icon: <ShoppingOutlined />,
      label: "Product Management",
    },
    {
      key: "/admin/order",
      icon: <AppstoreOutlined />,
      label: "Order Management",
    },
    {
      key: "/admin/category",
      icon: <AppstoreOutlined />,
      label: "Category Management",
    },
    {
      key: "/admin/brand",
      icon: <AppstoreOutlined />,
      label: "Brand Management",
    },
    {
      key: "/admin/blog",
      icon: <ReadOutlined />, // 📖 New Blog icon
      label: "Blog Management",
    },
    {
      key: "/admin/quiz",
      icon: <QuestionCircleOutlined />, // ❓ New Quiz icon
      label: "Quiz Management",
    },
    {
      key: "/admin/voucher",
      icon: <GiftOutlined />, // 🎁 Voucher icon
      label: "Voucher Management",
    },
    {
      key: "/admin/service",
      icon: <CustomerServiceOutlined />,
      label: "Service Management",
    },
    {
      key: "/admin/consultant-booking",
      icon: <SolutionOutlined />,
      label: "Quản lý đặt tư vấn"
    }
  ];

  return (
    <Sider
      collapsed={collapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      theme="dark"
      width={200}
      collapsedWidth={80}
    >
      <div
        style={{
          height: "64px",
          margin: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: collapsed ? "14px" : "18px",
          }}
        >
          {collapsed ? "Admin" : "Admin Panel"}
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
