import React, { useState } from "react";
import { Card, Col, Row, Statistic, Table, DatePicker, Select } from "antd";
import { Line, Pie, Column } from "@ant-design/charts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { uniqueNamesGenerator, colors } from "unique-names-generator"; // Tạo màu ngẫu nhiên
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const stats = {
  totalCustomers: 4500,
  totalRevenue: 98200,
  totalOrders: 7350,
  totalProductsSold: 18340,
  salesData: [
    { month: "Tháng 1", year: 2024, sales: 8000 },
    { month: "Tháng 2", year: 2024, sales: 10500 },
    { month: "Tháng 3", year: 2024, sales: 12000 },
    { month: "Tháng 4", year: 2024, sales: 15000 },
    { month: "Tháng 5", year: 2024, sales: 18000 },
    { month: "Tháng 6", year: 2024, sales: 22000 },
    { month: "Tháng 7", year: 2024, sales: 19500 },
    { month: "Tháng 8", year: 2024, sales: 21000 },
    { month: "Tháng 9", year: 2024, sales: 22500 },
    { month: "Tháng 10", year: 2024, sales: 24000 },
    { month: "Tháng 11", year: 2024, sales: 26000 },
    { month: "Tháng 12", year: 2024, sales: 28000 },

    { month: "Tháng 1", year: 2023, sales: 6000 },
    { month: "Tháng 2", year: 2023, sales: 8500 },
    { month: "Tháng 3", year: 2023, sales: 9500 },
    { month: "Tháng 4", year: 2023, sales: 12000 },
    { month: "Tháng 5", year: 2023, sales: 13500 },
    { month: "Tháng 6", year: 2023, sales: 16000 },
    { month: "Tháng 7", year: 2023, sales: 14000 },
    { month: "Tháng 8", year: 2023, sales: 15500 },
    { month: "Tháng 9", year: 2023, sales: 17000 },
    { month: "Tháng 10", year: 2023, sales: 19000 },
    { month: "Tháng 11", year: 2023, sales: 20500 },
    { month: "Tháng 12", year: 2023, sales: 22000 },
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

const Dashboard = () => {
  const [dateRange, setDateRange] = useState(null);

  const filteredSalesData = stats.salesData.filter((data) => {
    if (!dateRange) return true;
    const saleDate = dayjs(
      `${data.year}-${data.month.replace("Tháng ", "")}-01`
    );
    return saleDate.isBetween(dateRange[0], dateRange[1], "month", "[]");
  });
  const colorPalette = [
    "#1890ff",
    "#ff4d4f",
    "#52c41a",
    "#faad14",
    "#722ed1",
    "#13c2c2",
  ];

  // ✅ Kiểm tra nếu dữ liệu không có thì không tạo colorMap để tránh lỗi
  const uniqueYears =
    filteredSalesData.length > 0
      ? [...new Set(filteredSalesData.map((item) => item.year))]
      : [];

  // ✅ Nếu không có dữ liệu, đặt màu mặc định
  const colorMap =
    uniqueYears.length > 0
      ? uniqueYears.reduce((acc, year, index) => {
          acc[year] = colorPalette[index % colorPalette.length];
          return acc;
        }, {})
      : {};

  // ✅ Sắp xếp dữ liệu theo tháng để hiển thị đúng thứ tự
  const sortedSalesData = [...filteredSalesData].sort((a, b) => {
    return (
      a.year - b.year ||
      parseInt(a.month.replace("Tháng ", "")) -
        parseInt(b.month.replace("Tháng ", ""))
    );
  });
  const lineConfig = {
    data: sortedSalesData.map((item) => ({
      ...item,
      monthIndex: parseInt(item.month.replace("Tháng ", "")),
    })),
    xField: "monthIndex",
    yField: "sales",
    seriesField: "year",
    color: (datum) => colorMap[datum.year] || "#000000", // Nếu không có màu, dùng màu đen mặc định
    smooth: true,
    height: 300,
    point: { size: 5, shape: "circle" },
    legend: { position: "top" },
    xAxis: {
      label: {
        formatter: (val) => `Tháng ${val}`,
      },
    },
  };

  const pieConfig = {
    data: stats.productRevenue,
    angleField: "revenue",
    colorField: "category",
    height: 250,
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

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={12}>
          <RangePicker
            picker="month"
            onChange={(dates) => setDateRange(dates)}
            format="MM/YYYY"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số khách hàng"
              value={stats.totalCustomers}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix="₫"
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={stats.totalOrders} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm đã bán"
              value={stats.totalProductsSold}
            />
          </Card>
        </Col>
      </Row>

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
              columns={[
                { title: "Sản phẩm", dataIndex: "product", key: "product" },
                {
                  title: "Số lượng bán",
                  dataIndex: "quantity",
                  key: "quantity",
                },
              ]}
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
