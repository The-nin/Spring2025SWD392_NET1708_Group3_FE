import React from "react";
import { Card, Col, Row, Statistic, Table } from "antd";
import { Line, Pie, Column } from "@ant-design/charts";

// Dữ liệu giả lập
const stats = {
  totalCustomers: 4500,
  totalRevenue: 98200,
  totalOrders: 7350,
  totalProductsSold: 18340,
  salesData: [
    { month: "Tháng 1", sales: 8000 },
    { month: "Tháng 2", sales: 10500 },
    { month: "Tháng 3", sales: 12000 },
    { month: "Tháng 4", sales: 15000 },
    { month: "Tháng 5", sales: 18000 },
    { month: "Tháng 6", sales: 22000 },
  ],
  productRevenue: [
    { category: "Kem Dưỡng Da", revenue: 32000 },
    { category: "Tinh Chất (Serum)", revenue: 25000 },
    { category: "Kem Chống Nắng", revenue: 18000 },
    { category: "Sữa Rửa Mặt", revenue: 12000 },
    { category: "Nước Hoa Hồng", revenue: 11000 },
  ],
  topSpendingCustomers: [
    { customer: "Alice Johnson", spent: 1200 },
    { customer: "Michael Smith", spent: 1050 },
    { customer: "Sophia Lee", spent: 950 },
    { customer: "Daniel Brown", spent: 870 },
    { customer: "Emma Wilson", spent: 750 },
  ],
  topSellingProducts: [
    { key: 1, product: "Serum Vitamin C", quantity: 1500 },
    { key: 2, product: "Kem Dưỡng Ẩm", quantity: 1350 },
    { key: 3, product: "Kem Chống Nắng SPF 50", quantity: 1200 },
    { key: 4, product: "Serum Hyaluronic Acid", quantity: 950 },
  ],
};

// Cấu hình biểu đồ
const lineConfig = {
  data: stats.salesData,
  xField: "month",
  yField: "sales",
  smooth: true,
  height: 300,
  point: { size: 5, shape: "circle" },
  color: "#1890ff",
};

const pieConfig = {
  data: stats.productRevenue,
  angleField: "revenue",
  colorField: "category",
  height: 250,
  label: {
    type: "spider",
    style: { fontSize: 14 },
  },
};

const topCustomersConfig = {
  data: stats.topSpendingCustomers,
  xField: "customer",
  yField: "spent",
  height: 250,
  color: "#ff4d4f",
  label: { position: "top" },
  xAxis: { label: { rotate: 45 } },
};

// Cấu hình bảng dữ liệu
const productColumns = [
  { title: "Sản phẩm", dataIndex: "product", key: "product" },
  { title: "Số lượng bán", dataIndex: "quantity", key: "quantity" },
];

const Dashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
          >
            <Statistic
              title="Tổng số khách hàng"
              value={stats.totalCustomers}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
          >
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix="₫"
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
          >
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
          >
            <Statistic
              title="Tổng sản phẩm đã bán"
              value={stats.totalProductsSold.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <Card title="Tổng quan doanh số theo tháng">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Doanh thu theo danh mục sản phẩm">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <Card title="Khách hàng chi tiêu nhiều nhất">
            <Column {...topCustomersConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Sản phẩm bán chạy nhất">
            <Table
              dataSource={stats.topSellingProducts}
              columns={productColumns}
              pagination={false}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
