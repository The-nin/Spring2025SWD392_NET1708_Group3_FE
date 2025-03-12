import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined,
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
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Fetch vouchers from API
  const fetchVouchers = async (params = {}) => {
    try {
      setLoading(true);
      const { current = 1, pageSize = 10 } = params;
      const response = await getAllVouchers({ page: current - 1, pageSize });

      if (!response.error) {
        const { content, totalElements } = response.result;
        setVouchers(content);
        setPagination({ current, pageSize, total: totalElements });
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
    fetchVouchers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const showDeleteConfirm = (voucher) => {
    setSelectedVoucher(voucher);
    setDeleteModalVisible(true);
  };

  const showVoucherDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setViewModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVoucher) return;

    try {
      setDeletingVoucherId(selectedVoucher.id);
      const response = await deleteVoucher(selectedVoucher.id);

      if (!response.error) {
        setVouchers((prev) =>
          prev.filter((voucher) => voucher.id !== selectedVoucher.id)
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
    const newStatus = voucher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucher.id ? { ...v, status: newStatus } : v))
    );

    try {
      await updateVoucherStatus(voucher.id, newStatus);
      toast.success("Voucher status updated successfully!");
    } catch (error) {
      toast.error("Failed to update voucher status");
      setVouchers((prev) =>
        prev.map((v) =>
          v.id === voucher.id ? { ...v, status: voucher.status } : v
        )
      );
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
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm Giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount, record) =>
        record.discountType === "PERCENTAGE" ? `${discount}%` : `$${discount}`,
    },
    {
      title: "Loại Giảm Giá",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Giá Trị Đơn Hàng Tối Thiểu",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (value) => `$${value}`,
    },
    {
      title: "Điểm Yêu Cầu",
      dataIndex: "point",
      key: "point",
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) =>
        deletingVoucherId === record.id ? null : (
          <Space>
            <Tooltip title="Xem Chi Tiết">
              <Button
                icon={<EyeOutlined />}
                onClick={() => showVoucherDetails(record)}
              />
            </Tooltip>
            <Tooltip title="Xóa">
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
              />
            </Tooltip>
          </Space>
        ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản Lý Voucher</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/voucher/add")}
        >
          Thêm Voucher Mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{ emptyText: "Không có voucher nào" }}
      />

      <Modal
        title="Xác Nhận Xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedVoucher(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: deletingVoucherId !== null }}
      >
        <p>Bạn có chắc chắn muốn xóa voucher "{selectedVoucher?.code}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <Modal
        title="Chi Tiết Voucher"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedVoucher && (
          <div>
            <p>
              <strong>Mã Voucher:</strong> {selectedVoucher.code}
            </p>
            <p>
              <strong>Giảm Giá:</strong> {selectedVoucher.discount}%
            </p>
            <p>
              <strong>Loại Giảm Giá:</strong> {selectedVoucher.discountType}
            </p>
            <p>
              <strong>Giá Trị Đơn Hàng Tối Thiểu:</strong> $
              {selectedVoucher.minOrderValue}
            </p>
            <p>
              <strong>Điểm Yêu Cầu:</strong> {selectedVoucher.point}
            </p>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default VoucherManagement;
