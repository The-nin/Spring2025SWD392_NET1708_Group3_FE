import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

function Consultant() {
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showCombinationInputs, setShowCombinationInputs] = useState(false);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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

  const handleSkinTypeChange = (value) => {
    setShowCombinationInputs(value === "COMBINATION_SKIN");
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
              <Col span={18}>
                <Form.Item
                  name="name"
                  label="Your Fullname"
                  rules={[
                    { required: true, message: "Please enter your name here" },
                    {
                      min: 2,
                      message: "Your name must be at least 1 character",
                    },
                  ]}
                  className="mr-4"
                >
                  <Input
                    placeholder="Enter your fullname"
                    className="rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="age"
                  label="Your Age"
                  rules={[
                    { required: true, message: "Please enter your age" },
                    {
                      type: "number",
                      min: 10,
                      max: 120,
                      message: "Age must be between 10 and 120",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select or Enter Your Age"
                    className="w-full rounded-md h-12"
                    optionFilterProp="children"
                    allowClear
                  >
                    {Array.from({ length: 111 }, (_, i) => i + 10).map(
                      (age) => (
                        <Select.Option key={age} value={age}>
                          {age}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
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

            <Form.Item
              name="type_skin"
              label="Your Skin Type"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select Your Skin Type"
                className="w-full rounded-md h-12"
                onChange={handleSkinTypeChange}
              >
                <Select.Option value="NORMAL_SKIN">Normal</Select.Option>
                <Select.Option value="OILY_SKIN">Oily</Select.Option>
                <Select.Option value="SENSITIVE_SKIN">Sensitive</Select.Option>
                <Select.Option value="DRY_SKIN">Dry</Select.Option>
                <Select.Option value="COMBINATION_SKIN">
                  Combination
                </Select.Option>
              </Select>
            </Form.Item>

            {showCombinationInputs && (
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Oily" name="oily_percentage">
                    <Select
                      showSearch
                      placeholder="Enter Your Percentage"
                      className="w-full rounded-md h-12"
                      optionFilterProp="children"
                      allowClear
                    >
                      {Array.from({ length: 101 }, (_, i) => i).map((age) => (
                        <Select.Option key={age} value={age}>
                          {age}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Dry" name="dry_percentage">
                    <Select
                      showSearch
                      placeholder="Enter Your Percentage"
                      className="w-full rounded-md h-12"
                      optionFilterProp="children"
                      allowClear
                    >
                      {Array.from({ length: 101 }, (_, i) => i).map((age) => (
                        <Select.Option key={age} value={age}>
                          {age}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Sensitive" name="sensitive_percentage">
                    <Select
                      showSearch
                      placeholder="Enter Your Percentage"
                      className="w-full rounded-md h-12"
                      optionFilterProp="children"
                      allowClear
                    >
                      {Array.from({ length: 101 }, (_, i) => i).map((age) => (
                        <Select.Option key={age} value={age}>
                          {age}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Normal" name="normal_percentage">
                    <Select
                      showSearch
                      placeholder="Enter Your Percentage"
                      className="w-full rounded-md h-12"
                      optionFilterProp="children"
                      allowClear
                    >
                      {Array.from({ length: 101 }, (_, i) => i).map((age) => (
                        <Select.Option key={age} value={age}>
                          {age}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Button
              type="link"
              onClick={() => (window.location.href = "/skinquiz")}
              className="text-blue-600 hover:text-blue-800"
            >
              Not sure about your skin type? Take the Skin Quiz!
            </Button>
            <Form.Item
              name="thumbnail"
              label="Your Image"
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
