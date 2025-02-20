import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, message, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getAllCategories,
  deleteCategory,
} from "../../../service/category/index";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchCategories = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllCategories({
        page: params.page - 1 || 0,
        size: params.pageSize || 10,
      });

      if (!response.error) {
        setCategories(response.result.categoryResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchCategories({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const showDeleteConfirm = (category) => {
    setSelectedCategory(category);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      const response = await deleteCategory(selectedCategory.id);
      if (!response.error) {
        message.success("Category deleted successfully");
        await fetchCategories({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to delete category");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedCategory(null);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="category"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/category/edit/${record.id}`)}
            />
          </Tooltip>
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
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/category/add")}
        >
          Add New Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined className="text-xl" />
            <span>Delete Category</span>
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedCategory(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: loading,
        }}
        centered
        maskClosable={false}
        className="confirm-delete-modal"
      >
        <div className="py-4">
          <p className="text-lg mb-2">
            Are you sure you want to delete category{" "}
            <strong>"{selectedCategory?.name}"</strong>?
          </p>
          <p className="text-gray-500">
            This action cannot be undone and will permanently delete the
            category.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
