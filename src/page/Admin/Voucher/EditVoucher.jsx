import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVoucherById, updateVoucher } from "../../../service/voucher";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

function EditVoucher({ fetchVouchers }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get voucher ID from URL params

  // Fetch voucher details
  useEffect(() => {
    const fetchVoucher = async () => {
      setLoading(true);
      try {
        const response = await getVoucherById(id);
        if (!response.error) {
          setVoucher(response.result);
          form.setFieldsValue({
            code: response.result.code,
            discount: response.result.discount,
            discountType: response.result.discountType,
            minOrderValue: response.result.minOrderValue,
            description: response.result.description,
            point: response.result.point,
            quantity: response.result.quantity,
          });
        } else {
          toast.error("Hiện khuyến mãi thất bại");
          navigate("/admin/voucher");
        }
      } catch (error) {
        toast.error("Hiện thông tin khuyến mãi thất bại");
        navigate("/admin/voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      console.log("📤 Updating Voucher Data:", values);

      const formattedValues = {
        ...values,
        code: values.code.trim(),
        discount: Number(values.discount),
        minOrderValue: Number(values.minOrderValue),
        point: Number(values.point),
      };

      const response = await updateVoucher(id, formattedValues);

      if (!response.error) {
        toast.success("Cập nhật khuyến mãi thành công!");
        fetchVouchers?.();
        setTimeout(() => navigate("/admin/voucher"), 2000);
      } else {
        toast.error(response.message || "Cập nhật khuyến mãi thất bại");
      }
    } catch (error) {
      toast.error("Cập nhật khuyến mãi thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!voucher) return <p>Loading khuyến mãi details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/voucher")}
        className="mb-4"
      >
        Quay lại danh sách khuyến mãi
      </Button>

      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Khuyến Mãi</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          label="Mã Khuyến Mãi"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
        >
          <Input placeholder="Nhập mã khuyến mãi" />
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
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="PERCENTAGE">Phần trăm</Select.Option>
            <Select.Option value="FIXED">Giảm số tiền cố định</Select.Option>
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
            Cập Nhật Khuyễn Mãi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditVoucher;
