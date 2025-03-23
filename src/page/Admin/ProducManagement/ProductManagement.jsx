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
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    priceRange: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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

  const getPriceRangeValues = (priceRange) => {
    switch (priceRange) {
      case "0-500000":
        return { minPrice: 0, maxPrice: 500000 };
      case "500000-1000000":
        return { minPrice: 500000, maxPrice: 1000000 };
      case "1000000-5000000":
        return { minPrice: 1000000, maxPrice: 5000000 };
      case "5000000-10000000":
        return { minPrice: 5000000, maxPrice: 10000000 };
      case "10000000+":
        return { minPrice: 10000000, maxPrice: null };
      default:
        return { minPrice: null, maxPrice: null };
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts({ page: 0, size: 1000 }); // Fetch all products at once

      if (!response.error) {
        setAllProducts(response.result.productResponses);
        extractFilters(response.result.productResponses);
        applyFilters(response.result.productResponses, filters);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (productsToFilter, currentFilters) => {
    let result = [...productsToFilter];

    // Apply keyword filter
    if (currentFilters.keyword) {
      const keyword = currentFilters.keyword.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          (product.description &&
            product.description.toLowerCase().includes(keyword))
      );
    }

    // Apply category filter
    if (currentFilters.categorySlug) {
      result = result.filter(
        (product) =>
          product.category &&
          product.category.slug === currentFilters.categorySlug
      );
    }

    // Apply brand filter
    if (currentFilters.brandSlug) {
      result = result.filter(
        (product) =>
          product.brand && product.brand.slug === currentFilters.brandSlug
      );
    }

    // Apply price range filter
    if (currentFilters.priceRange) {
      const { minPrice, maxPrice } = getPriceRangeValues(
        currentFilters.priceRange
      );
      result = result.filter((product) => {
        if (minPrice !== null && maxPrice !== null) {
          return product.price >= minPrice && product.price <= maxPrice;
        } else if (minPrice !== null) {
          return product.price >= minPrice;
        } else if (maxPrice !== null) {
          return product.price <= maxPrice;
        }
        return true;
      });
    }

    // Apply sorting
    if (currentFilters.sortBy) {
      result.sort((a, b) => {
        let aValue = a[currentFilters.sortBy];
        let bValue = b[currentFilters.sortBy];

        // Handle nested properties like category.name
        if (currentFilters.sortBy.includes(".")) {
          const parts = currentFilters.sortBy.split(".");
          aValue = parts.reduce((obj, key) => obj && obj[key], a);
          bValue = parts.reduce((obj, key) => obj && obj[key], b);
        }

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (typeof aValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return currentFilters.order === "asc" ? comparison : -comparison;
        } else {
          return currentFilters.order === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }

    // Update filtered products and pagination
    setFilteredProducts(result);
    setProducts(result.slice(0, pagination.pageSize));
    setPagination({
      ...pagination,
      current: 1,
      total: result.length,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const newFilters = { ...filters };

    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.order = sorter.order === "ascend" ? "asc" : "desc";
    }

    setFilters(newFilters);

    // Apply pagination
    const startIndex = (newPagination.current - 1) * newPagination.pageSize;
    const endIndex = startIndex + newPagination.pageSize;

    setProducts(filteredProducts.slice(startIndex, endIndex));
    setPagination({
      ...newPagination,
      total: filteredProducts.length,
    });

    // If sorting changed, reapply filters
    if (sorter.field) {
      applyFilters(allProducts, newFilters);
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
        // Update local data after successful deletion
        const updatedAllProducts = allProducts.filter(
          (p) => p.id !== selectedProduct.id
        );
        setAllProducts(updatedAllProducts);

        // Reapply filters to update the view
        applyFilters(updatedAllProducts, filters);

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
    applyFilters(allProducts, newFilters);
  };

  const handleStatusChange = async (checked, record) => {
    try {
      setLoading(true);
      const newStatus = checked ? "ACTIVE" : "INACTIVE";
      const response = await updateProductStatus(record.id, newStatus);

      if (!response.error) {
        toast.success("Cập nhật trạng thái sản phẩm thành công!");

        // Update the product in allProducts and filteredProducts
        const updatedAllProducts = allProducts.map((p) =>
          p.id === record.id ? { ...p, status: newStatus } : p
        );
        setAllProducts(updatedAllProducts);

        // Reapply filters to update the view
        applyFilters(updatedAllProducts, filters);
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
        <Select
          placeholder="Lọc theo khoảng giá"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => handleFilterChange("priceRange", value)}
        >
          <Select.Option value="0-500000">Dưới 500.000đ</Select.Option>
          <Select.Option value="500000-1000000">
            500.000đ - 1.000.000đ
          </Select.Option>
          <Select.Option value="1000000-5000000">
            1.000.000đ - 5.000.000đ
          </Select.Option>
          <Select.Option value="5000000-10000000">
            5.000.000đ - 10.000.000đ
          </Select.Option>
          <Select.Option value="10000000+">Trên 10.000.000đ</Select.Option>
        </Select>
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
