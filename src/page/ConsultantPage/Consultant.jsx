import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

function Consultant() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <>
      <div className="">
        <Card
          title={
            <h2 className="text-2xl font-semibold text-gray-800">
              INFORMATION ABOUT YOUR SKIN
            </h2>
          }
          className="max-w-5xl mx-auto shadow-md rounded-lg my-10"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="space-y-6"
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name here",
                    },
                    {
                      min: 2,
                      message: "Your name must be at least 2 character",
                    },
                  ]}
                  className="mr-4"
                >
                  <Input
                    placeholder="Enter your first name"
                    className="rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="lasttName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your last name here",
                    },
                    {
                      min: 2,
                      message: "Your name must be at least 2 character",
                    },
                  ]}
                  className="mr-4"
                >
                  <Input
                    placeholder="Enter your last name"
                    className="rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="age"
                  label="Your age"
                  rules={[
                    { required: true, message: "Please enter your age" },
                    {
                      type: "number",
                      min: 10,
                      message: "Age must be greater than 10",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full rounded-md h-12"
                    placeholder="Enter your age here"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="expert"
                  label="Choose Expert"
                  rules={[
                    { required: true, message: "Please select an expert" },
                  ]}
                >
                  <Select
                    className="w-full rounded-md h-12"
                    placeholder="Select an expert"
                  >
                    <Select.Option value="NONE">None</Select.Option>
                    <Select.Option value="NORMAL_SKIN">
                      Nguyen van A
                    </Select.Option>
                    <Select.Option value="OILY_SKIN">Thi B</Select.Option>
                    <Select.Option value="SENSITIVE_SKIN">
                      Hoang van C
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={11} className="ml-10">
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name here",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={onChange}
                    needConfirm showTime
                    className="w-full rounded-md h-12"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="skinConditaion"
              label="Description"
              rules={[
                { required: true, message: "Please enter description" },
                {
                  min: 10,
                  message: "Description must be at least 10 characters",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter product description"
                maxLength={500}
                showCount
                className="rounded-md"
              />
            </Form.Item>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="type_skin"
                  label="Your Skin Type"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select
                    placeholder="Select a Your Skin Type"
                    className="w-full rounded-md h-12"
                  >
                    <Select.Option value="NORMAL_SKIN">Normal</Select.Option>
                    <Select.Option value="OILY_SKIN">Oily</Select.Option>
                    <Select.Option value="SENSITIVE_SKIN">
                      Sensitive
                    </Select.Option>
                    <Select.Option value="DRY_SKIN">Dry</Select.Option>
                    <Select.Option value="COMBINATION_SKIN">
                      Combination
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={11} className="ml-10">
                <Form.Item name="allergy" label="Allergy">
                  <InputNumber
                    className="w-full rounded-md h-12"
                    placeholder="Enter input allergy (if have)"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="thumbnail"
              label="Your Image (Face skin, product)"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false}
                // maxCount={1}
                accept="image/*"
                onPreview={handlePreview}
                listType="picture"
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />} className="rounded-md h-12">
                  Select Image
                </Button>
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto px-8 h-12 rounded-md bg-blue-600 hover:bg-blue-700"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Consultant;
