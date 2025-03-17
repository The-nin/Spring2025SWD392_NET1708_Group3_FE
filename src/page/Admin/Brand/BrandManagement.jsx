import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Tag, Switch, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { getAllBrands, deleteBrand } from "../../../service/brand/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BrandManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "",
    order: "",
  });

  const fetchBrands = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page !== undefined ? params.page - 1 : 0,
        size: params.pageSize || 10,
      };

      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.order) queryParams.order = params.order;

      const response = await getAllBrands(queryParams);

      if (!response.error) {
        setBrands(response.result.brandResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch brands", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
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

    fetchBrands(params);
  };

  const showDeleteConfirm = (brand) => {
    setSelectedBrand(brand);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBrand) return;

    try {
      setLoading(true);
      const response = await deleteBrand(selectedBrand.id);

      if (!response.error) {
        await fetchBrands({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        toast.success("Brand deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete brand", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedBrand(null);
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
          alt="thương hiệu"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Tên thương hiệu",
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
              onClick={() => navigate(`/admin/brand/detail/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/brand/edit/${record.id}`)}
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
        <h2 className="text-2xl font-bold">Quản lý thương hiệu</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/brand/add")}
        >
          Thêm thương hiệu mới
        </Button>
      </div>
      <div className="mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên thương hiệu"
          onSearch={(value) => {
            const params = {
              page: pagination.current,
              pageSize: pagination.pageSize,
              keyword: value,
            };
            fetchBrands(params);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
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
          setSelectedBrand(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa thương hiệu "{selectedBrand?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BrandManagement;
