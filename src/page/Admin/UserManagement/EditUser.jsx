import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import {
  editUser,
  uploadToCloudinary,
  getUserById,
} from "../../../service/userManagement";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

const EditUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        if (response && response.code === 200) {
          const userData = response.result;
          setInitialData(userData);
          setImageUrl(userData.avatar);

          form.setFieldsValue({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            gender: userData.gender || undefined,
            username: userData.username,
            roleName: userData.roleName,
            birthday: userData.birthday ? moment(userData.birthday) : undefined,
            phone: userData.phone || "",
            avatar: userData.avatar
              ? [
                  {
                    uid: "-1",
                    name: "avatar",
                    status: "done",
                    url: userData.avatar,
                  },
                ]
              : [],
          });
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let avatarUrl = imageUrl;

      if (values.avatar?.length > 0 && values.avatar[0].originFileObj) {
        const file = values.avatar[0].originFileObj;
        try {
          const cloudinaryUrl = await uploadToCloudinary(file);
          if (cloudinaryUrl) {
            avatarUrl = cloudinaryUrl;
          }
        } catch (error) {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      const formData = { ...initialData };
      formData.avatar = avatarUrl;
      formData.firstName = values.firstName;
      formData.lastName = values.lastName;
      formData.birthday = values.birthday?.format("YYYY-MM-DD");
      formData.gender = values.gender;
      if (values.password) formData.password = values.password;
      formData.phone = values.phone;
      formData.roleName = values.roleName;

      const response = await editUser(id, formData);
      if (response && response.code === 200) {
        navigate("/admin/user");
        toast.success(response.message);
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
        <h2 className="text-2xl font-bold">Edit User</h2>
      </div>
      {initialData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-2xl"
        >
          <Form.Item
            name="avatar"
            label="Avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="avatar"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              defaultFileList={
                imageUrl
                  ? [
                      {
                        uid: "-1",
                        name: "avatar",
                        status: "done",
                        url: imageUrl,
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Change Avatar</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="firstName" label="First Name">
            <Input />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name">
            <Input />
          </Form.Item>

          <Form.Item name="birthday" label="Birthday">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="username" label="Username">
            <Input disabled />
          </Form.Item>

          <Form.Item name="roleName" label="Role">
            <Select>
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="DELIVERY">Delivery</Select.Option>
              <Select.Option value="STAFF">Staff</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            extra="Leave blank to keep current password"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update User
            </Button>
            <Button className="ml-2" onClick={() => navigate("/admin/")}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>Loading...</div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EditUser;
