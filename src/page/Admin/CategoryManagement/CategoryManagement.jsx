import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Tag, Switch, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  getAllCategories,
  deleteCategory,
} from "../../../service/category/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "",
    order: "",
  });

  const fetchCategories = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page !== undefined ? params.page - 1 : 0,
        size: params.pageSize || 10,
      };

      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.order) queryParams.order = params.order;

      const response = await getAllCategories(queryParams);

      if (!response.error) {
        setCategories(response.result.categoryResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const params = {
      ...filters,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    };

    if (sorter.field) {
      params.sortBy = sorter.field;
      params.order = sorter.order ? sorter.order.replace("end", "") : undefined;
    }

    fetchCategories(params);
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
        await fetchCategories({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        toast.success("Category deleted successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedCategory(null);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="danh mục"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`/admin/category/detail/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/category/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
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
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/category/add")}
        >
          Thêm danh mục mới
        </Button>
      </div>
      <div className="mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên danh mục"
          onSearch={(value) => {
            const params = {
              page: pagination.current,
              pageSize: pagination.pageSize,
              keyword: value,
            };
            fetchCategories(params);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedCategory(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CategoryManagement;
