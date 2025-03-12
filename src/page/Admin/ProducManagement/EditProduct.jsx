import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Spin,
  Upload,
  Select,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../../service/productManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getAllCategories } from "../../../service/category/index";
import { getAllBrandsUser } from "../../../service/brand/index";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [usageInstruction, setUsageInstruction] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  useEffect(() => {
    const initializeData = async () => {
      await fetchCategoriesAndBrands();
      await fetchProductDetails();
    };

    initializeData();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await getProductById(id);
      if (!response.error) {
        const product = response.result;

        const categoryExists = categories.some(
          (cat) => cat.id === product.category_id
        );
        const brandExists = brands.some(
          (brand) => brand.id === product.brand_id
        );

        form.setFieldsValue({
          name: product.name,
          price: product.price,
          description: product.description,
          ingredient: product.ingredient,
          usageInstruction: product.usageInstruction,
          status: product.status,
          brand_id: brandExists ? product.brand_id : undefined,
          category_id: categoryExists ? product.category_id : undefined,
          specification: {
            origin: product.specification?.origin || "",
            brandOrigin: product.specification?.brandOrigin || "",
            manufacturingLocation:
              product.specification?.manufacturingLocation || "",
            skinType: product.specification?.skinType || "",
          },
        });
        setDescription(product.description || "");
        setIngredient(product.ingredient || "");
        setUsageInstruction(product.usageInstruction || "");
        setCurrentThumbnail(product.thumbnail);
      } else {
        toast.error(response.message);
        navigate("/admin/product");
      }
    } catch (error) {
      toast.error("Failed to fetch product details");
      navigate("/admin/product");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoryResponse, brandResponse] = await Promise.all([
        getAllCategories(),
        getAllBrandsUser(),
      ]);

      if (!categoryResponse.error) {
        setCategories(categoryResponse.result?.categoryResponses || []);
      } else {
        toast.error("Failed to fetch categories");
      }

      if (!brandResponse.error) {
        setBrands(brandResponse.result?.brandResponses || []);
      } else {
        toast.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch form data");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      const requestData = {
        name: values.name.trim(),
        price: parseFloat(values.price),
        description: description,
        ingredient: ingredient,
        usageInstruction: usageInstruction,
        status: values.status,
        brand_id: values.brand_id,
        category_id: values.category_id,
        specification: {
          origin: values.specification.origin,
          brandOrigin: values.specification.brandOrigin,
          manufacturingLocation: values.specification.manufacturingLocation,
          skinType: values.specification.skinType,
        },
      };

      formData.append("request", JSON.stringify(requestData));

      if (values.thumbnail?.length > 0) {
        formData.append("thumbnail", values.thumbnail[0].originFileObj);
      }

      const response = await updateProduct(id, formData);

      if (!response.error) {
        navigate("/admin/product");
        toast.success("Product updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-6xl">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/product")}
            className="mb-4 hover:bg-gray-100"
          >
            Back to Products
          </Button>

          <Card
            title="Edit Product"
            className="w-full shadow-md"
            headStyle={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                  { min: 3, message: "Name must be at least 3 characters" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[
                  { required: true, message: "Please enter price" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Price must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  placeholder="Enter price"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                  {
                    validator: (_, value) => {
                      if (!description || description.trim().length < 10) {
                        return Promise.reject(
                          "Description must be at least 10 characters"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  style={{ height: "200px", marginBottom: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="ingredient"
                label="Ingredient"
                rules={[
                  {
                    required: true,
                    message: "Please enter ingredient information",
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  value={ingredient}
                  onChange={setIngredient}
                  modules={modules}
                  formats={formats}
                  style={{ height: "200px", marginBottom: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="usageInstruction"
                label="Usage Instruction"
                rules={[
                  {
                    required: true,
                    message: "Please enter usage instructions",
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  value={usageInstruction}
                  onChange={setUsageInstruction}
                  modules={modules}
                  formats={formats}
                  style={{ height: "200px", marginBottom: "40px" }}
                />
              </Form.Item>

              <Form.Item label="Current Thumbnail">
                {currentThumbnail && (
                  <img
                    src={currentThumbnail}
                    alt="Current thumbnail"
                    className="max-w-xs mb-4"
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </Form.Item>

              <Form.Item
                name="thumbnail"
                label="New Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload New Image</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select>
                  <Select.Option value="ACTIVE">Active</Select.Option>
                  <Select.Option value="INACTIVE">Inactive</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="brand_id"
                label="Brand"
                rules={[{ required: true, message: "Please select brand" }]}
              >
                <Select
                  placeholder="Select a brand"
                  options={brands.map((brand) => ({
                    value: brand.id,
                    label: brand.name,
                  }))}
                  className="w-full rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select a category"
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  className="w-full rounded-md"
                />
              </Form.Item>

              <Form.Item label="Specification" className="mb-0">
                <Card className="bg-gray-50">
                  <Form.Item
                    name={["specification", "origin"]}
                    label="Origin"
                    rules={[{ required: true, message: "Please enter origin" }]}
                  >
                    <Input placeholder="Enter origin" />
                  </Form.Item>

                  <Form.Item
                    name={["specification", "brandOrigin"]}
                    label="Brand Origin"
                    rules={[
                      { required: true, message: "Please enter brand origin" },
                    ]}
                  >
                    <Input placeholder="Enter brand origin" />
                  </Form.Item>

                  <Form.Item
                    name={["specification", "manufacturingLocation"]}
                    label="Manufacturing Location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter manufacturing location",
                      },
                    ]}
                  >
                    <Input placeholder="Enter manufacturing location" />
                  </Form.Item>

                  <Form.Item
                    name={["specification", "skinType"]}
                    label="Skin Type"
                    rules={[
                      { required: true, message: "Please enter skin type" },
                    ]}
                  >
                    <Input placeholder="Enter skin type" />
                  </Form.Item>
                </Card>
              </Form.Item>

              <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Product
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
