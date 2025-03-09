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
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const formattedValues = {
        code: values.voucherCode.trim(),
        discount: Number(values.discountAmount),
        discountType: values.discountType,
        minOrderValue: Number(values.minOrderValue),
        description: values.description.trim(),
        point: Number(values.point),
      };

      const response = await createVoucher(formattedValues);

      if (!response.error) {
        toast.success("Voucher added successfully!");
        setSuccessMessage("Voucher added successfully!");
        form.resetFields();
        if (fetchVouchers) {
          fetchVouchers();
        }
        setTimeout(() => {
          navigate("/admin/voucher");
        }, 2000);
      } else {
        handleError(response.message || "Failed to add voucher");
      }
    } catch (error) {
      handleError("Failed to save the voucher. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    console.error("Error:", message);
    toast.error(message);
    setErrorMessage(message);
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
          initialValue="PERCENTAGE"
          rules={[{ required: true, message: "Please select discount type" }]}
        >
          <Select>
            <Select.Option value="PERCENTAGE">Percentage</Select.Option>
            <Select.Option value="FIXED">Fixed Amount</Select.Option>
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
            },
          ]}
        >
          <Input type="number" placeholder="Enter discount amount" />
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
