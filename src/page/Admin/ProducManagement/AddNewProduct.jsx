import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Upload,
  Select,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../service/productManagement/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCategories } from "../../../service/category/index";
import { getAllBrandsUser } from "../../../service/brand/index";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [ingredientContent, setIngredientContent] = useState("");
  const [usageInstructionContent, setUsageInstructionContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const categoryResponse = await getAllCategories();
      if (!categoryResponse.error) {
        setCategories(categoryResponse.result?.categoryResponses || []);
      } else {
        toast.error("Failed to fetch categories");
      }

      const brandResponse = await getAllBrandsUser();
      if (!brandResponse.error) {
        setBrands(brandResponse.result?.brandResponses || []);
      } else {
        toast.error("Failed to fetch brands");
      }
    };
    fetchData();
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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

  const onFinish = async (values) => {
    if (
      values.name &&
      values.price &&
      editorContent &&
      ingredientContent &&
      usageInstructionContent &&
      values.thumbnail?.length > 0 &&
      values.categoryId &&
      values.brandId &&
      values.origin &&
      values.brandOrigin &&
      values.manufacturingLocation &&
      values.skinType
    ) {
      try {
        setLoading(true);
        const formData = new FormData();
        const file = values.thumbnail[0].originFileObj;

        if (!file) {
          message.error("Please select a file");
          return;
        }

        formData.append(
          "request",
          JSON.stringify({
            name: values.name,
            price: values.price,
            description: editorContent,
            ingredient: ingredientContent,
            usageInstruction: usageInstructionContent,
            specification: {
              origin: values.origin,
              brandOrigin: values.brandOrigin,
              manufacturingLocation: values.manufacturingLocation,
              skinType: values.skinType,
            },
            category_id: values.categoryId,
            brand_id: values.brandId,
          })
        );
        formData.append("thumbnail", file);

        const response = await addProduct(formData);
        if (!response.error) {
          navigate("/admin/product", {
            state: { message: response.message, type: "success" },
          });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to add product");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 p-6 overflow-y-auto">
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
        theme="light"
      />

      <div className="max-w-6xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/product")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Products
        </Button>

        <Card
          title={
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Product
            </h2>
          }
          className="shadow-md rounded-lg"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                    { min: 3, message: "Name must be at least 3 characters" },
                  ]}
                >
                  <Input
                    placeholder="Enter product name"
                    className="rounded-md"
                  />
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
                    className="w-full rounded-md"
                    min={0.01}
                    step={0.01}
                    placeholder="Enter price"
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  name="categoryId"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
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

                <Form.Item
                  name="brandId"
                  label="Brand"
                  rules={[{ required: true, message: "Please select a brand" }]}
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
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Product Details
              </h3>
              <div className="space-y-6">
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter description" },
                    {
                      validator: (_, value) => {
                        if (
                          !editorContent ||
                          editorContent.trim().length < 10
                        ) {
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
                    value={editorContent}
                    onChange={(content) => {
                      setEditorContent(content);
                      form.setFieldsValue({ description: content });
                    }}
                    modules={modules}
                    formats={formats}
                    style={{ height: "200px", marginBottom: "40px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="ingredient"
                  label="Ingredient"
                  rules={[
                    { required: true, message: "Please enter ingredient" },
                    {
                      validator: (_, value) => {
                        if (
                          !ingredientContent ||
                          ingredientContent.trim().length < 10
                        ) {
                          return Promise.reject(
                            "Ingredient must be at least 10 characters"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <ReactQuill
                    theme="snow"
                    value={ingredientContent}
                    onChange={(content) => {
                      setIngredientContent(content);
                      form.setFieldsValue({ ingredient: content });
                    }}
                    modules={modules}
                    formats={formats}
                    style={{ height: "150px", marginBottom: "40px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="usageInstruction"
                  label="Usage Instruction"
                  rules={[
                    {
                      required: true,
                      message: "Please enter usage instruction",
                    },
                    {
                      validator: (_, value) => {
                        if (
                          !usageInstructionContent ||
                          usageInstructionContent.trim().length < 10
                        ) {
                          return Promise.reject(
                            "Usage instruction must be at least 10 characters"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <ReactQuill
                    theme="snow"
                    value={usageInstructionContent}
                    onChange={(content) => {
                      setUsageInstructionContent(content);
                      form.setFieldsValue({ usageInstruction: content });
                    }}
                    modules={modules}
                    formats={formats}
                    style={{ height: "150px", marginBottom: "40px" }}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Specification Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Specification Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="origin"
                  label="Origin"
                  rules={[
                    { required: true, message: "Please enter origin" },
                    { min: 2, message: "Origin must be at least 2 characters" },
                  ]}
                >
                  <Input
                    placeholder="Enter product origin"
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="brandOrigin"
                  label="Brand Origin"
                  rules={[
                    { required: true, message: "Please enter brand origin" },
                    {
                      min: 2,
                      message: "Brand origin must be at least 2 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter brand origin"
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="manufacturingLocation"
                  label="Manufacturing Location"
                  rules={[
                    {
                      required: true,
                      message: "Please enter manufacturing location",
                    },
                    {
                      min: 2,
                      message:
                        "Manufacturing location must be at least 2 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter manufacturing location"
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="skinType"
                  label="Skin Type"
                  rules={[
                    { required: true, message: "Please enter skin type" },
                    {
                      min: 2,
                      message: "Skin type must be at least 2 characters",
                    },
                  ]}
                >
                  <Input placeholder="Enter skin type" className="rounded-md" />
                </Form.Item>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Product Image
              </h3>
              <Form.Item
                name="thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  listType="picture"
                  className="upload-list-inline"
                >
                  <Button icon={<UploadOutlined />} className="rounded-md">
                    Select Image
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="px-8 h-12 rounded-md bg-blue-600 hover:bg-blue-700"
              >
                Add Product
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewProduct;
