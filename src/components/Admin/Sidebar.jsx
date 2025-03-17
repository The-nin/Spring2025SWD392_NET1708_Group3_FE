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
import { label } from "framer-motion/client";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem("role") || "STAFF";

  const permissions = {
    "/admin": ["ADMIN"],
    "/admin/product": ["ADMIN", "MANAGER", "STAFF"],
    "/admin/order": ["ADMIN", "MANAGER", "STAFF", "DELIVERY"],
    "/admin/category": ["ADMIN", "MANAGER"],
    "/admin/brand": ["ADMIN", "MANAGER"],
    "/admin/blog": ["ADMIN", "MANAGER", "EXPERT"],
    "/admin/quiz": ["ADMIN", "MANAGER", "EXPERT"],
    "/admin/voucher": ["ADMIN", "MANAGER"],
    "/admin/service": ["ADMIN", "MANAGER", "STAFF"],
    "/admin/consultant-booking": ["EXPERT"],
    "/admin/consultant-all-booking": ["ADMIN", "MANAGER"],
    "/admin/staff-manage-consultant-order": ["STAFF"],
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
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
      key: "/admin/consultant-booking", //Quản lý tư vấn theo từng expert
      icon: <SolutionOutlined />,
      label: "Quản lý đặt tư vấn",
    },
    {
      key: "/admin/consultant-all-booking", //Quản lý tư vấn role admin
      icon: <SolutionOutlined />,
      label: "Quản lý đặt tư vấn",
    },
    {
      key: "/admin/staff-manage-consultant-order",
      icon: <SolutionOutlined />,
      label: "Quản lý đặt tư vấn",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    permissions[item.key]?.includes(userRole)
  );

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
        // items={menuItems}
        items={filteredMenuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
