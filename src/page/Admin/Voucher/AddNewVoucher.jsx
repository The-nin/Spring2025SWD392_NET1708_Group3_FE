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

      console.log("📤 Submitted Voucher Data:", values);

      const formattedValues = {
        code: values.code.trim(),
        discount: Number(values.discount),
        discountType: values.discountType,
        minOrderValue: Number(values.minOrderValue),
        description: values.description.trim(),
        point: Number(values.point),
      };

      const response = await createVoucher(formattedValues);

      if (!response.error) {
        toast.success("Voucher added successfully!");
        form.resetFields();
        fetchVouchers?.();
        setTimeout(() => navigate("/admin/voucher"), 2000);
      } else {
        toast.error(response.message || "Failed to add voucher");
      }
    } catch (error) {
      toast.error("Failed to save the voucher. Please check the details.");
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
        Quay lại danh sách Voucher
      </Button>

      <h2 className="text-2xl font-bold mb-4">Thêm Voucher Mới</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          label="Mã Voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
        >
          <Input placeholder="Nhập mã voucher" />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Mức Giảm Giá"
          rules={[{ required: true, message: "Vui lòng nhập mức giảm giá" }]}
        >
          <Input type="number" placeholder="Nhập mức giảm giá" />
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Loại Giảm Giá"
          initialValue="PERCENTAGE"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="PERCENTAGE">Phần trăm</Select.Option>
            <Select.Option value="FIXED_AMOUNT">
              Giảm số tiền cố định
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="minOrderValue"
          label="Giá Trị Đơn Hàng Tối Thiểu"
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            step="0.1"
            placeholder="Nhập giá trị tối thiểu"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          name="point"
          label="Điểm Yêu Cầu"
          rules={[{ required: true, message: "Vui lòng nhập số điểm yêu cầu" }]}
        >
          <Input type="number" placeholder="Nhập số điểm yêu cầu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Voucher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddNewVoucher;
