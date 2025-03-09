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
  Select,
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
  const [filters, setFilters] = useState({
    keyword: "",
    categorySlug: "",
    brandSlug: "",
    originSlug: "",
    sortBy: "",
    order: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const extractFilters = (products) => {
    const categoriesMap = new Map();
    const brandsMap = new Map();

    products.forEach((product) => {
      if (product.category) {
        categoriesMap.set(product.category.slug, {
          name: product.category.name,
          slug: product.category.slug,
        });
      }
      if (product.brand) {
        brandsMap.set(product.brand.slug, {
          name: product.brand.name,
          slug: product.brand.slug,
        });
      }
    });

    setCategories(Array.from(categoriesMap.values()));
    setBrands(Array.from(brandsMap.values()));
  };

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page !== undefined ? params.page - 1 : 0,
        size: params.pageSize || 10,
        ...params,
      };

      Object.keys(queryParams).forEach(
        (key) =>
          (queryParams[key] === undefined || queryParams[key] === "") &&
          delete queryParams[key]
      );

      const response = await getAllProducts(queryParams);
      if (!response.error) {
        setProducts(response.result.productResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
        extractFilters(response.result.productResponses);
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

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    fetchProducts({
      ...newFilters,
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleStatusChange = async (checked, record) => {
    try {
      setLoading(true);
      const newStatus = checked ? "ACTIVE" : "INACTIVE";
      const response = await updateProductStatus(record.id, newStatus);

      if (!response.error) {
        toast.success("Product status updated successfully!");
        // Refresh the current page
        fetchProducts({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        toast.error(response.message);
        // Revert the switch if there's an error
        record.status = !checked ? "ACTIVE" : "INACTIVE";
      }
    } catch (error) {
      toast.error("Failed to update product status");
      // Revert the switch if there's an error
      record.status = !checked ? "ACTIVE" : "INACTIVE";
    } finally {
      setLoading(false);
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
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text, record) => record.category?.name || "N/A",
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (text, record) => record.brand?.name || "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) => (price ? `${price.toLocaleString("vi-VN")}đ` : "N/A"),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => stock || 0,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
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
              onClick={() => navigate(`/admin/product/detail/${record.id}`)}
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
      <div className="mb-4 flex gap-4">
        <Input.Search
          placeholder="Search by keyword"
          onSearch={(value) => handleFilterChange("keyword", value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by Category"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => handleFilterChange("categorySlug", value)}
        >
          {categories.map((category) => (
            <Select.Option key={category.slug} value={category.slug}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
        {brands.length > 0 && (
          <Select
            placeholder="Filter by Brand"
            style={{ width: 200 }}
            allowClear
            onChange={(value) => handleFilterChange("brandSlug", value)}
          >
            {brands.map((brand) => (
              <Select.Option key={brand.slug} value={brand.slug}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        )}
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
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
