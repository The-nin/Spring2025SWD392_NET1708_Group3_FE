import { useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { createVoucher } from "../../../service/voucher";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function AddNewVoucher({ fetchVouchers }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formattedValues = {
        code: values.voucherCode.trim(),
        discount: parseFloat(values.discountAmount),
        discountType: values.discountType,
        minOrderValue: parseFloat(values.minOrderValue),
        description: values.description.trim(),
        point: parseInt(values.point),
      };

      const response = await createVoucher(formattedValues);

      if (response.message) {
        toast.success(response.message);
      }

      if (!response.error) {
        form.resetFields();
        if (fetchVouchers) {
          await fetchVouchers();
        }
        navigate("/admin/voucher");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/voucher")}
        className="mb-4"
      >
        Back to Vouchers
      </Button>

      <h2 className="text-2xl font-bold mb-4">Add New Voucher</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* Voucher Code */}
        <Form.Item
          name="voucherCode"
          label="Voucher Code"
          rules={[{ required: true, message: "Please enter a voucher code" }]}
        >
          <Input placeholder="Enter voucher code" />
        </Form.Item>

        {/* Discount Type */}
        <Form.Item
          name="discountType"
          label="Discount Type"
          initialValue="FIXED_AMOUNT"
          rules={[{ required: true, message: "Please select discount type" }]}
        >
          <Select>
            <Select.Option value="FIXED_AMOUNT">
              Fixed Amount (VND)
            </Select.Option>
            <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
          </Select>
        </Form.Item>

        {/* Discount Amount */}
        <Form.Item
          name="discountAmount"
          label="Discount Amount"
          rules={[
            { required: true, message: "Please enter a discount amount" },
            {
              type: "number",
              transform: (value) => Number(value),
              message: "Please enter a valid number",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const discountType = getFieldValue("discountType");
                if (discountType === "PERCENTAGE" && value > 100) {
                  return Promise.reject(
                    "Percentage cannot be greater than 100%"
                  );
                }
                if (value <= 0) {
                  return Promise.reject("Amount must be greater than 0");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            type="number"
            placeholder={`Enter discount ${
              form.getFieldValue("discountType") === "PERCENTAGE"
                ? "(0-100)"
                : "amount"
            }`}
          />
        </Form.Item>

        {/* Minimum Order Value */}
        <Form.Item
          name="minOrderValue"
          label="Minimum Order Value"
          rules={[
            { required: true, message: "Please enter minimum order value" },
            {
              type: "number",
              min: 0.1,
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input
            type="number"
            step="0.1"
            placeholder="Enter minimum order value"
          />
        </Form.Item>

        {/* Points */}
        <Form.Item
          name="point"
          label="Points"
          rules={[
            { required: true, message: "Please enter points" },
            {
              type: "number",
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input type="number" placeholder="Enter points" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Voucher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddNewVoucher;
