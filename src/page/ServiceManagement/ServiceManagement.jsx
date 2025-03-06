import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip } from "antd";
import { toast } from "react-toastify";
import { getAllService } from "../../service/serviceManagement";

function ServiceManagement() {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchService = async () => {
    try {
      const data = await getAllService();
      setService(data);
    } catch (error) {
      toast.error("Error loading services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName) => (serviceName ? serviceName : "N/A"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `${price.toLocaleString()} đ` : "N/A"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
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
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/service/add")}
        >
          Add New Service
        </Button>
      </div>

      <Table dataSource={service} columns={columns} loading={loading} />
    </div>
  );
}

export default ServiceManagement;
