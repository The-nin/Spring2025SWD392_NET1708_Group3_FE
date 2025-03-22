import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal } from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllVouchers,
  deleteVoucher,
  updateVoucherStatus,
} from "../../../service/voucher/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to format numbers
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
};

const formatDiscountType = (type) => {
  return type === "PERCENTAGE"
    ? "Giảm giá theo %"
    : "Giảm giá theo tổng số tiền";
};

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

  useEffect(() => {
    fetchVouchers();
  }, []);

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
        toast.error(response.message || "Lỗi khi lấy danh sách voucher");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchVouchers(newPagination.current - 1, newPagination.pageSize);
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
        toast.success("Voucher đã được xóa thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Lỗi khi xóa voucher");
    } finally {
      setDeletingVoucherId(null);
      setDeleteModalVisible(false);
      setSelectedVoucher(null);
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
        record.discountType === "PERCENTAGE"
          ? `${discount}%`
          : formatCurrency(discount),
    },
    {
      title: "Loại Giảm Giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) => formatDiscountType(type),
    },
    {
      title: "Giá Trị Đơn Hàng Tối Thiểu",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Điểm Yêu Cầu",
      dataIndex: "point",
      key: "point",
      render: (value) => value.toLocaleString("vi-VN"),
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

      {/* Delete Modal */}
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

      {/* View Modal */}
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
              <strong>Giảm Giá:</strong>{" "}
              {selectedVoucher.discountType === "PERCENTAGE"
                ? `${selectedVoucher.discount}%`
                : formatCurrency(selectedVoucher.discount)}
            </p>
            <p>
              <strong>Loại Giảm Giá:</strong>{" "}
              {formatDiscountType(selectedVoucher.discountType)}
            </p>
            <p>
              <strong>Giá Trị Đơn Hàng Tối Thiểu:</strong>{" "}
              {formatCurrency(selectedVoucher.minOrderValue)}
            </p>
            <p>
              <strong>Điểm Yêu Cầu:</strong>{" "}
              {selectedVoucher.point.toLocaleString("vi-VN")}
            </p>
            {selectedVoucher.quantity && (
              <p>
                <strong>Số Lượng:</strong>{" "}
                {selectedVoucher.quantity.toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default VoucherManagement;
