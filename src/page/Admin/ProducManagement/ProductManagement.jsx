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
        toast.success("Xóa sản phẩm thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
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
        toast.success("Cập nhật trạng thái sản phẩm thành công!");
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
      toast.error("Không thể cập nhật trạng thái sản phẩm");
      // Revert the switch if there's an error
      record.status = !checked ? "ACTIVE" : "INACTIVE";
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text, record) => record.category?.name || "N/A",
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (text, record) => record.brand?.name || "N/A",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) => (price ? `${price.toLocaleString("vi-VN")}đ` : "N/A"),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => stock || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Active"
          unCheckedChildren="Unactive"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`/admin/product/detail/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/product/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
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
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/product/add")}
        >
          Thêm sản phẩm mới
        </Button>
      </div>
      <div className="mb-4 flex gap-4">
        <Input.Search
          placeholder="Tìm kiếm theo từ khóa"
          onSearch={(value) => handleFilterChange("keyword", value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Lọc theo danh mục"
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
            placeholder="Lọc theo thương hiệu"
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
            `${range[0]}-${range[1]} của ${total} mục`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedProduct(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
