import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Select, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getUsersAdmin,
  updateUserStatus,
  deleteUser,
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
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
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
        toast.success("Cập nhật trạng thái thành công!");
        fetchUsers();
      } else {
        toast.error("Không thể cập nhật trạng thái người dùng");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      content: "Hành động này không thể hoàn tác",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteUser(userId);
          if (response && response.code === 200) {
            toast.success("Xóa người dùng thành công!");
            fetchUsers();
          } else {
            toast.error("Không thể xóa người dùng");
          }
        } catch (error) {
          toast.error("Lỗi khi xóa người dùng");
        }
      },
    });
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
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <img
            src={avatar}
            alt="Ảnh đại diện"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "Không có",
    },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_, record) => {
        const firstName = record.firstName || "";
        const lastName = record.lastName || "";
        return firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : "Không có";
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => gender || "Không có",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={(checked) =>
            handleStatusChange(record.id, checked ? "ACTIVE" : "INACTIVE")
          }
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/user/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/user/add")}
        >
          Thêm người dùng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          // onClick: () => navigate(`/admin/users/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
