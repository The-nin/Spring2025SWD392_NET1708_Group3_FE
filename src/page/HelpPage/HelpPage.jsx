import {
  Button,
  Card,
  Col,
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
import { motion } from "framer-motion";

function HelpPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <motion.div
        className="w-full max-w-5xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          title={
            <motion.h2
              className="text-2xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              SEND HELP REQUEST TO CUSTOMER CARE
            </motion.h2>
          }
          className="shadow-md rounded-lg"
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
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Form.Item
                    name="name"
                    label="Your Fullname"
                    rules={[
                      { required: true, message: "Please enter your name" },
                      {
                        min: 2,
                        message: "Your name must be at least 2 characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Your Fullname"
                      className="rounded-md h-12"
                    />
                  </Form.Item>
                </motion.div>
              </Col>

              <Col span={6}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  viewport={{ once: true }}
                >
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
                      showSearch // Allows users to type their age manually
                      placeholder="Select or Enter Your Age"
                      className="w-full rounded-md h-12"
                      optionFilterProp="children"
                      allowClear // Allows clearing selection
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
                </motion.div>
              </Col>
            </Row>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                  {
                    min: 10,
                    message: "Description must be at least 10 characters",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your description"
                  maxLength={500}
                  showCount
                  className="rounded-md"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Form.Item
                name="thumbnail"
                label="Enter Image Of Problem"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  beforeUpload={() => false}
                  accept="image/*"
                  onPreview={handlePreview}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />} className="rounded-md h-12">
                    Select Image
                  </Button>
                </Upload>

                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
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
            </motion.div>
          </Form>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default HelpPage;
