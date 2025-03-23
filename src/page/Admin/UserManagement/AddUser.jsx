import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import {
  addUser,
  uploadToCloudinary,
} from "../../../service/userManagement/index";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

const AddUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      let avatarUrl = null;
      // Upload image first if exists
      if (values.avatar?.length > 0) {
        const file = values.avatar[0].originFileObj;
        try {
          avatarUrl = await uploadToCloudinary(file);
        } catch (error) {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      const formData = {
        ...values,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        avatar: avatarUrl, // Use the uploaded image URL
      };

      const response = await addUser(formData);
      if (response && response.code === 201) {
        toast.success(response.message);
        navigate("/admin/user");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Thêm Người Dùng Mới</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-2xl"
      >
        <Form.Item
          name="avatar"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="avatar"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="firstName" label="Tên">
          <Input />
        </Form.Item>

        <Form.Item name="lastName" label="Họ">
          <Input />
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Ngày sinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item name="gender" label="Giới tính">
          <Select>
            <Select.Option value="MALE">Nam</Select.Option>
            <Select.Option value="FEMALE">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="roleName"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select>
            <Select.Option value="STAFF">Nhân viên</Select.Option>
            <Select.Option value="DELIVERY">Giao hàng</Select.Option>
            <Select.Option value="MANAGER">Quản lí</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm người dùng
          </Button>
          <Button className="ml-2" onClick={() => navigate("/admin/user")}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
