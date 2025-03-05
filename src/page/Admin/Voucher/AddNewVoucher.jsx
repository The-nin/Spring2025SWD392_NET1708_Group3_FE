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

      console.log("📤 Submitted Voucher Data:", values);

      const formattedValues = {
        voucherName: values.voucherName.trim(),
        voucherCode: values.voucherCode.trim(),
        point: Number(values.point),
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
        description: values.description.trim(),
        discountAmount: Number(values.discountAmount),
        status: values.status,
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
        {/* Voucher Name */}
        <Form.Item
          name="voucherName"
          label="Voucher Name"
          rules={[
            { required: true, message: "Please enter a voucher name" },
            {
              min: 5,
              message: "Voucher name must be at least 5 characters long",
            }, // ✅ Minimum 5 characters
          ]}
        >
          <Input placeholder="Enter voucher name" />
        </Form.Item>

        {/* Voucher Code */}
        <Form.Item
          name="voucherCode"
          label="Voucher Code"
          rules={[
            { required: true, message: "Please enter a voucher code" },
            {
              min: 5,
              message: "Voucher name must be at least 5 characters long",
            }, // ✅ Minimum 5 characters
          ]}
        >
          <Input placeholder="Enter voucher code" />
        </Form.Item>

        {/* Points */}
        <Form.Item
          name="point"
          label="Points"
          rules={[
            { required: true, message: "Please enter points" },
            {
              type: "number",
              min: 1,
              transform: (value) => Number(value),
              message: "Points must be greater than 0",
            },
          ]}
        >
          <Input type="number" placeholder="Enter points" />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          name="endDate"
          label="End Date"
          dependencies={["startDate"]}
          rules={[
            { required: true, message: "Please select an end date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("startDate");
                if (!value || !startDate) {
                  return Promise.resolve();
                }
                if (dayjs(value).isAfter(dayjs(startDate))) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("End date must be after the start date!")
                );
              },
            }),
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter a description" },
            {
              min: 5,
              message: "Voucher name must be at least 5 characters long",
            }, // ✅ Minimum 5 characters
          ]}
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        {/* Discount Amount */}
        <Form.Item
          name="discountAmount"
          label="Discount Amount"
          rules={[
            { required: true, message: "Please enter a discount amount" },
            {
              type: "number",
              min: 0.01,
              transform: (value) => Number(value),
              message: "Discount must be greater than 0",
            },
          ]}
        >
          <Input
            type="number"
            step="0.01"
            placeholder="Enter discount amount"
          />
        </Form.Item>

        {/* Voucher Status */}
        <Form.Item
          name="status"
          label="Status"
          initialValue="INACTIVE"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select>
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="INACTIVE">Inactive</Select.Option>
          </Select>
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
