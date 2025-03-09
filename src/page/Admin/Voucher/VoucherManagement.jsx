import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined, // 👁️ Import View Icon
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllVouchers,
  deleteVoucher,
  updateVoucherStatus,
} from "../../../service/voucher/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VoucherManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingVoucherId, setDeletingVoucherId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false); // 👁️ View Details Modal State

  // Fetch vouchers from API
  const fetchVouchers = async (page = 0, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getAllVouchers(page, pageSize);

      if (!response.error) {
        setVouchers(response.result);
        setPagination({
          current: response.pagination.pageNumber + 1, // Convert from 0-based to 1-based
          pageSize: response.pagination.pageSize,
          total: response.pagination.totalElements,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleTableChange = (newPagination) => {
    // Convert from 1-based to 0-based page number for API
    fetchVouchers(newPagination.current - 1, newPagination.pageSize);
  };

  const showDeleteConfirm = (voucher) => {
    setSelectedVoucher(voucher);
    setDeleteModalVisible(true);
  };

  // Show View Details Modal
  const showVoucherDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setViewModalVisible(true);
  };

  // Optimized Delete Function with Local State for Loading
  const handleDeleteConfirm = async () => {
    if (!selectedVoucher) return;

    try {
      setDeletingVoucherId(selectedVoucher.id);
      const response = await deleteVoucher(selectedVoucher.id);

      if (!response.error) {
        setVouchers((prevVouchers) =>
          prevVouchers.filter((voucher) => voucher.id !== selectedVoucher.id)
        );
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
        toast.success("Voucher deleted successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete voucher");
    } finally {
      setDeletingVoucherId(null);
      setDeleteModalVisible(false);
      setSelectedVoucher(null);
    }
  };

  const toggleVoucherStatus = async (voucher) => {
    try {
      setLoading(true);
      const newStatus = voucher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateVoucherStatus(voucher.id, newStatus);

      if (!response.error) {
        toast.success("Voucher status updated successfully!");
        setVouchers((prevVouchers) =>
          prevVouchers.map((v) =>
            v.id === voucher.id ? { ...v, status: newStatus } : v
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update voucher status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Voucher Code",
      dataIndex: "voucherCode",
      key: "voucherCode",
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Expire Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={() => toggleVoucherStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        deletingVoucherId === record.id ? null : (
          <Space>
            {/* 👁️ View Details Button */}
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                onClick={() => showVoucherDetails(record)}
              />
            </Tooltip>

            {/* ✏️ Edit Button */}
            <Tooltip title="Edit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/voucher/edit/${record.id}`)}
                disabled={deletingVoucherId === record.id}
              />
            </Tooltip>

            {/* 🗑️ Delete Button */}
            <Tooltip title="Delete">
              <Button
                danger
                icon={
                  deletingVoucherId === record.id ? (
                    <LoadingOutlined />
                  ) : (
                    <DeleteOutlined />
                  )
                }
                onClick={() => showDeleteConfirm(record)}
                disabled={deletingVoucherId === record.id}
              />
            </Tooltip>
          </Space>
        ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Voucher Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/voucher/add")}
        >
          Add New Voucher
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedVoucher(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete voucher "
          {selectedVoucher?.voucherCode}"?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>

      {/* 👁️ View Details Modal */}
      <Modal
        title="Voucher Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedVoucher && (
          <div>
            <p>
              <strong>Voucher Code:</strong> {selectedVoucher.voucherCode}
            </p>
            <p>
              <strong>Discount Amount:</strong> {selectedVoucher.discountAmount}
              %
            </p>
            <p>
              <strong>Start Date:</strong> {selectedVoucher.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {selectedVoucher.endDate}
            </p>
            <p>
              <strong>Status:</strong> {selectedVoucher.status}
            </p>
            <p>
              <strong>Description:</strong> {selectedVoucher.description}
            </p>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default VoucherManagement;
