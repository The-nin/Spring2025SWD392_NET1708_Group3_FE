import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip } from "antd";
import { toast } from "react-toastify";
import { getAllConsultantBookingByExpert } from "../../../service/booking";

function ExpertService() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  //   const navigate = useNavigate();

  const fetchBookOrder = async () => {
    try {
      setLoading(true);
      const response = await getAllConsultantBookingByExpert();

      if (response) {
        setOrders(response);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Thất bại trong việc lấy dữ liệu order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookOrder();
    console.log(orders);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName) => (serviceName ? serviceName : "N/A"),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày dặt lịch",
      dataIndex: "bookDate",
      key: "bookDate",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `${price.toLocaleString()} VNĐ` : "N/A"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              // onClick={() => navigate(`/admin/product/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              //   onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý dịch vụ khách hàng</h2>
      </div>

      <Table dataSource={orders} columns={columns} loading={loading} />
    </div>
  );
}

export default ExpertService;
