import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Spin,
  Alert,
  Typography,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getDashboardData } from "../../../service/dashboard/index";

// Đăng ký các thành phần ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const { Title: AntTitle } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Pass the date range to the API call
        const response = await getDashboardData(
          dateRange?.[0]?.format("DD/MM/YYYY"),
          dateRange?.[1]?.format("DD/MM/YYYY")
        );
        if (response.error) {
          setError(response.message || "Failed to fetch dashboard data");
        } else {
          setDashboardData(response);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]); // Add dateRange as a dependency

  // Chuẩn bị dữ liệu cho biểu đồ doanh thu theo thời gian
  const prepareRevenueData = () => {
    if (!dashboardData?.revenueByTimes?.length) return null;

    // Nhóm doanh thu theo ngày
    const groupedData = dashboardData.revenueByTimes.reduce((acc, item) => {
      const date = item.revenueDate.split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.revenue;
      return acc;
    }, {});

    // Chuyển đổi thành mảng để sử dụng trong biểu đồ
    const labels = Object.keys(groupedData).sort();
    const data = labels.map((date) => groupedData[date]);

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data,
          backgroundColor: "rgba(75,192,192,0.6)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Chuẩn bị dữ liệu cho biểu đồ top sản phẩm bán chạy
  const prepareTopProductsData = () => {
    if (!dashboardData?.topSellingProducts?.length) return null;

    const labels = dashboardData.topSellingProducts.map(
      (product) => product.productName
    );
    const data = dashboardData.topSellingProducts.map(
      (product) => product.quantitySold
    );

    return {
      labels,
      datasets: [
        {
          label: "Số lượng bán ra",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chuẩn bị dữ liệu cho biểu đồ phân bổ đơn hàng theo trạng thái
  const prepareOrderStatusData = () => {
    if (!dashboardData?.orderStatuses?.length) return null;

    const labels = dashboardData.orderStatuses.map(
      (status) => status.statusLabel
    );
    const data = dashboardData.orderStatuses.map((status) => status.orderCount);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)", // Đang giao
            "rgba(75, 192, 192, 0.6)", // Đã giao
            "rgba(255, 206, 86, 0.6)", // Đang xử lý
            "rgba(255, 99, 132, 0.6)", // Đã hủy
            "rgba(153, 102, 255, 0.6)", // Giao thất bại
            "rgba(255, 159, 64, 0.6)", // Chờ xử lý
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Cấu hình chung cho các biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          // Hiển thị đầy đủ tên sản phẩm trong tooltip
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
        },
      },
    },
  };

  // Cấu hình riêng cho biểu đồ doanh thu
  const revenueChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(
          5000000,
          ...(dashboardData?.revenueByTimes?.map((item) => item.revenue) || [
            5000000,
          ])
        ),
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN");
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
    barPercentage: 0.2,
    categoryPercentage: 0.2,
  };

  // Cấu hình riêng cho biểu đồ sản phẩm bán chạy
  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(
          10,
          ...(dashboardData?.topSellingProducts?.map(
            (product) => product.quantitySold
          ) || [10])
        ),
        title: {
          display: true,
          text: "Số lượng",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sản phẩm",
        },
      },
    },
    barPercentage: 0.4,
    categoryPercentage: 0.2,
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  // Chuẩn bị dữ liệu biểu đồ
  const revenueData = prepareRevenueData();
  const topProductsData = prepareTopProductsData();
  const orderStatusData = prepareOrderStatusData();

  return (
    <>
      <div className="flex justify-between items-center mb-6 pl-4">
        <div>
          <AntTitle level={2} className="mb-1">
            Dashboard
          </AntTitle>
          <div className="text-gray-600">
            <HomeOutlined />{" "}
            <a href="/admin" className="text-blue-500 hover:underline">
              Admin
            </a>{" "}
            / <span>Dashboard</span>
          </div>
        </div>
        <div>
          <RangePicker onChange={handleDateChange} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      ) : (
        <>
          {/* Thống kê tổng quan */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Statistic
                  title="Tổng doanh thu"
                  value={dashboardData?.totalRevenue || 0}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="VNĐ"
                  formatter={(value) => `${value.toLocaleString("vi-VN")}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Statistic
                  title="Tổng đơn hàng hoàn thành"
                  value={dashboardData?.totalOrdersDone || 0}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Statistic
                  title="Tổng khách hàng"
                  value={dashboardData?.totalCustomers || 0}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Statistic
                  title="Sản phẩm đã bán"
                  value={dashboardData?.totalProductsSold || 0}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ doanh thu */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24}>
              <Card
                title="Doanh thu theo ngày"
                bordered={false}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <div style={{ height: "400px" }}>
                  {revenueData ? (
                    <Bar data={revenueData} options={revenueChartOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>Không có dữ liệu doanh thu</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ phụ - removed the table section */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12} className="mb-6">
              <Card
                title="Top sản phẩm bán chạy"
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div style={{ height: "300px" }}>
                  {topProductsData ? (
                    <Bar data={topProductsData} options={barChartOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>Không có dữ liệu sản phẩm bán chạy</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12} className="mb-6">
              <Card
                title="Phân bổ trạng thái đơn hàng"
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div style={{ height: "300px" }}>
                  {orderStatusData ? (
                    <Pie data={orderStatusData} options={chartOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>Không có dữ liệu trạng thái đơn hàng</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Dashboard;
