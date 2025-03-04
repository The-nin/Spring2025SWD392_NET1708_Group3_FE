import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  InputNumber,
  Select,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getVoucherById, updateVoucher } from "../../../service/voucher/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const { Option } = Select;

// Disable past dates
const disabledDate = (current) => current && current.isBefore(dayjs(), "day");

const EditVoucher = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [voucherData, setVoucherData] = useState(null); // Store API data

  useEffect(() => {
    if (id) {
      fetchVoucherDetails();
    }
  }, [id]); // ✅ Fetch data when ID changes

  useEffect(() => {
    if (voucherData && Object.keys(voucherData).length > 0) {
      console.log("📌 Updating form with:", voucherData);
      form.setFieldsValue(voucherData);
    }
  }, [voucherData, form]);

  const fetchVoucherDetails = async () => {
    try {
      const response = await getVoucherById(id);
      console.log("✅ Raw API Response:", response);

      if (!response.error && response.result && response.result.result) {
        const voucher = response.result.result; // ✅ Correct data extraction

        const formattedData = {
          voucherName: voucher.voucherName ?? "Unknown Name",
          voucherCode: voucher.voucherCode ?? "Unknown Code",
          point: voucher.point ?? 0,
          startDate: voucher.startDate ? dayjs(voucher.startDate) : null,
          endDate: voucher.endDate ? dayjs(voucher.endDate) : null,
          description: voucher.description ?? "No Description",
          discountAmount: voucher.discountAmount ?? 0,
          status: voucher.status ?? "INACTIVE",
        };

        console.log("📌 Final Processed Data Before Setting:", formattedData);
        setVoucherData(formattedData); // ✅ Correctly setting the voucher data
      } else {
        toast.error(response.message || "Failed to fetch voucher details");
        navigate("/admin/voucher");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("Failed to fetch voucher details");
      navigate("/admin/voucher");
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const voucherData = {
        voucherName: values.voucherName?.trim() || "",
        voucherCode: values.voucherCode?.trim() || "",
        point: values.point ? Number(values.point) : 0,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        description: values.description?.trim() || "No description",
        discountAmount: values.discountAmount
          ? parseFloat(values.discountAmount)
          : 0,
        status: values.status,
      };

      console.log("📤 Sending JSON:", JSON.stringify(voucherData, null, 2));

      const response = await updateVoucher(id, voucherData);

      if (!response.error) {
        toast.success("Voucher updated successfully!");
        navigate("/admin/voucher");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(
        "❌ API Request Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update voucher");
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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/voucher")}
          className="mb-4"
        >
          Back to Vouchers
        </Button>

        <Card title="Edit Voucher" className="max-w-3xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="voucherName"
              label="Voucher Name"
              rules={[
                { required: true, message: "Please enter voucher name" },
                {
                  min: 5,
                  message: "Voucher name must be at least 5 characters long",
                },
              ]}
            >
              <Input placeholder="Enter voucher name" />
            </Form.Item>

            <Form.Item
              name="voucherCode"
              label="Voucher Code"
              rules={[
                { required: true, message: "Please enter voucher code" },
                {
                  min: 5,
                  message: "Voucher code must be at least 5 characters long",
                },
              ]}
            >
              <Input placeholder="Enter voucher code" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Voucher Description"
              rules={[
                { required: true, message: "Please enter voucher description" },
                {
                  min: 5,
                  message:
                    "Voucher description must be at least 5 characters long",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter voucher description"
              />
            </Form.Item>

            <Form.Item
              name="point"
              label="Points Required"
              rules={[
                { required: true, message: "Please enter required points" },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="discountAmount"
              label="Discount Amount (%)"
              rules={[
                { required: true, message: "Please enter discount amount" },
              ]}
            >
              <InputNumber
                min={0.01}
                max={100}
                step={0.01}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                { required: true, message: "Please select a start date" },
              ]}
            >
              <DatePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Expiration Date"
              rules={[
                { required: true, message: "Please select an expiration date" },
              ]}
            >
              <DatePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Voucher
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditVoucher;
