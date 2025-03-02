import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  getUsersAdmin,
  deleteUser,
  updateUserStatus,
} from "../../../service/userManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsersAdmin(
        params.page || pagination.current,
        params.pageSize || pagination.pageSize
      );

      if (response && response.code === 200) {
        setUsers(response.result.userResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchUsers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateUserStatus(userId, newStatus);
      if (response && response.code === 200) {
        toast.success("User status updated successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user status");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      const response = await deleteUser(selectedUser.id);
      if (response && response.code === 200) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <img
            src={avatar}
            alt="User avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          "No avatar"
        ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Full Name",
      key: "fullName",
      render: (_, record) => {
        const firstName = record.firstName || "";
        const lastName = record.lastName || "";
        return firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : "N/A";
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => gender || "N/A",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/users/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedUser(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete user #{selectedUser?.username}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
