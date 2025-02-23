import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Tag, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllBrands, deleteBrand, updateBrandStatus } from "../../../service/brand/index";
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

  const fetchBrands = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllBrands({
        page: params.page - 1 || 0,
        size: params.pageSize || 10,
      });

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

  const handleTableChange = (newPagination) => {
    fetchBrands({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
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

  const toggleBrandStatus = async (brand) => {
    try {
      setLoading(true);
      const newStatus = brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateBrandStatus(brand.id, newStatus);
      if (!response.error) {
        toast.success("Brand status updated successfully!");
        fetchBrands({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update brand status");
    } finally {
      setLoading(false);
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
          alt="brand"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Brand Name",
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
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={() => toggleBrandStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
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
              onClick={() => navigate(`/admin/brand/edit/${record.id}`)}
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
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/brand/add")}
        >
          Add New Brand
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedBrand(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete brand "{selectedBrand?.name}"?</p>
        <p>This action cannot be undone.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BrandManagement;
