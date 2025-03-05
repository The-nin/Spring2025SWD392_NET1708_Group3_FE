import React, { useState, useEffect } from "react";
import { Table, Space, Card, message, Button } from "antd";
import { getBatches } from "../../../service/batch/index";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const BatchManagement = () => {
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState({
    content: [],
    totalElements: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã lô",
      dataIndex: "batchCode",
      key: "batchCode",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      key: "importPrice",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
  ];

  const fetchBatches = async (params = {}) => {
    setLoading(true);
    try {
      console.log("Bắt đầu gọi API");
      const response = await getBatches({
        page: params.current - 1,
        size: params.pageSize,
      });
      console.log("Kết quả API:", response);
      if (response && response.result) {
        setBatchData({
          content: response.result.content,
          totalElements: response.result.totalElements,
        });
        setPagination({
          ...params,
          total: response.result.totalElements,
        });
      } else {
        message.error("Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      message.error("Lỗi khi tải dữ liệu lô hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches(pagination);
  }, []);

  const handleTableChange = (newPagination) => {
    fetchBatches(newPagination);
  };

  return (
    <Card
      title="Quản lý lô hàng"
      extra={
        <Button type="primary" onClick={() => navigate("/admin/batch/add")}>
          Thêm lô hàng mới
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={batchData.content}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default BatchManagement;
