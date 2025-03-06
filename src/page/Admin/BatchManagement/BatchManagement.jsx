import React, { useState, useEffect } from "react";
import { Table, Space, Card, message, Button, Input } from "antd";
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
  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "",
    order: "",
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã lô",
      dataIndex: "batchCode",
      key: "batchCode",
      sorter: true,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
      const queryParams = {
        page: params.current ? params.current - 1 : 0,
        size: params.pageSize || 10,
      };

      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.order) queryParams.order = params.order;

      const response = await getBatches(queryParams);
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

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const params = {
      ...filters,
      ...newPagination,
    };

    if (sorter.field) {
      params.sortBy = sorter.field;
      params.order = sorter.order ? sorter.order.replace("end", "") : undefined;
    }

    fetchBatches(params);
  };

  return (
    <Card
      title="Quản lý lô hàng"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo mã lô"
            onSearch={(value) => {
              const params = {
                current: pagination.current,
                pageSize: pagination.pageSize,
                keyword: value,
              };
              fetchBatches(params);
            }}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" onClick={() => navigate("/admin/batch/add")}>
            Thêm lô hàng mới
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={batchData.content}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default BatchManagement;
