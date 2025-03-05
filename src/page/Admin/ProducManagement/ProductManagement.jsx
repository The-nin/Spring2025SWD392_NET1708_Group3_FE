import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tooltip,
  message,
  Modal,
  Switch,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  deleteProduct,
  updateProductStatus,
} from "../../../service/productManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    categorySlug: "",
    brandSlug: "",
    originSlug: "",
    sortBy: "",
    order: "",
  });

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page !== undefined ? params.page - 1 : 0,
        size: params.pageSize || 10,
      };

      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.categorySlug) queryParams.categorySlug = params.categorySlug;
      if (params.brandSlug) queryParams.brandSlug = params.brandSlug;
      if (params.originSlug) queryParams.originSlug = params.originSlug;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.order) queryParams.order = params.order;

      const response = await getAllProducts(queryParams);
      if (!response.error) {
        setProducts(response.result.productResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const params = {
      ...filters,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      keyword: filters.keyword,
    };

    if (sorter.field) {
      params.sortBy = sorter.field;
      params.order = sorter.order ? sorter.order.replace("end", "") : undefined;
    }

    fetchProducts(params);
  };

  const toggleStatus = async (product) => {
    try {
      setLoading(true);
      const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateProductStatus(product.id, newStatus);
      if (!response.error) {
        fetchProducts({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        toast.success("Product status updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      const response = await deleteProduct(selectedProduct.id);

      if (!response.error) {
        await fetchProducts({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        toast.success("Product deleted successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedProduct(null);
    }
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="product"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      filterable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) => (price ? `${price.toLocaleString("vi-VN")}đ` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "ACTIVE"}
          onChange={() => toggleStatus(record)}
          checkedChildren="ACTIVE"
          unCheckedChildren="INACTIVE"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Details">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => {
                setSelectedProduct(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/product/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
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
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/product/add")}
        >
          Add New Product
        </Button>
      </div>
      <div className="mb-4">
        <Input.Search
          placeholder="Search by keyword"
          onSearch={(value) => {
            const params = {
              page: pagination.current,
              pageSize: pagination.pageSize,
            };
            if (value) {
              params.keyword = value;
            }
            fetchProducts(params);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={products}
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
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedProduct(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete product "{selectedProduct?.name}"?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
      <Modal
        title="Product Details"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedProduct(null);
        }}
        footer={null}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-bold">Product Name</h3>
              <p>{selectedProduct.name}</p>
            </div>
            <div>
              <h3 className="font-bold">Description</h3>
              <p>{selectedProduct.description}</p>
            </div>
            <div>
              <h3 className="font-bold">Price</h3>
              <p>{selectedProduct.price?.toLocaleString("vi-VN")}đ</p>
            </div>
            <div>
              <h3 className="font-bold">Status</h3>
              <p>{selectedProduct.status}</p>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
