import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Space,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { addNewBatch } from "../../../service/batch";
import { getAllProducts } from "../../../service/productManagement";

const AddNewBatch = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (!response.error) {
        setProducts(response.result.productResponses || []);
      } else {
        message.error("Lỗi khi tải danh sách sản phẩm");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm");
    }
  };

  const onFinish = async (values) => {
    try {
      const formattedData = {
        ...values,
        manufactureDate: values.manufactureDate.format("YYYY-MM-DD"),
        expirationDate: values.expirationDate.format("YYYY-MM-DD"),
        importPrice: parseFloat(values.importPrice),
        quantity: parseInt(values.quantity),
      };

      await addNewBatch(formattedData);
      message.success("Thêm lô hàng mới thành công");
      navigate("/admin/batch");
    } catch (error) {
      message.error("Lỗi khi thêm lô hàng mới");
    }
  };

  return (
    <Card title="Thêm lô hàng mới">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="productId"
          label="Sản phẩm"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            options={products.map((product) => ({
              value: product.id,
              label: product.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="importPrice"
          label="Giá nhập"
          rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
        >
          <Input type="number" step="0.1" />
        </Form.Item>

        <Form.Item
          name="manufactureDate"
          label="Ngày sản xuất"
          rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="expirationDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
            <Button onClick={() => navigate("/admin/batch")}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddNewBatch;
