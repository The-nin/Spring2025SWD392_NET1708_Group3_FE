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
import moment from "moment";
import { useEffect, useState } from "react";
import { createBooking, getAllExperts } from "../../service/booking";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../service/productManagement";
// import { set } from "date-fns";
import { getServices } from "../../service/serviceManagement";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Consultant() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);

  const navigate = useNavigate();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log("Uploaded files:", e?.fileList);
    return e?.fileList || [];
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

  //Set times
  const availableTimes = [
    { start: "08:00", end: "09:00" },
    { start: "10:00", end: "11:00" },
    { start: "14:00", end: "15:00" },
    { start: "16:00", end: "17:00" },
  ];

  // State để lưu lại khung giờ và ngày đã chọn
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  //Call api
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      setLoading(true);

      const imageFiles = values.image.map((fileObj) => fileObj.originFileObj);

      const imageURLs = await Promise.all(
        imageFiles.map(async (file) => await uploadToCloudinary(file))
      );

      const bookingData = {
        firstName: values.firstName,
        lastName: values.lastName,
        skinType: values.skinType,
        skinCondition: values.skinCondition,
        allergy: values.allergy || "",
        bookDate: values.bookDate.toISOString(),
        expertId: values.expertId || "",
        age: values.age,
        note: values.note || "",
        skincareServiceId: values.skincareServiceId,
        imageSkins: imageURLs.map((url) => ({ image: url })),
      };

      const response = await createBooking(bookingData);

      if (response) {
        toast.success("Booking created successfully");
        form.resetFields();
        setFileList([]);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const data = await getAllExperts();
      setExperts(data);
    } catch (err) {
      console.error("Failed to fetch experts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <>
      <div className="">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

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
                  name="lastName"
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
                  label="Your Age"
                  rules={[{ required: true, message: "Please enter your age" }]}
                >
                  <InputNumber
                    placeholder="Enter Your Age"
                    className="w-full rounded-md h-12"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="expertId"
                  label="Choose Expert"
                  className="mr-4"
                >
                  <Select
                    className="w-full rounded-md h-12"
                    placeholder="Select an expert"
                    options={experts.map((expert) => ({
                      value: expert.id,
                      label: `${expert.firstName} ${expert.lastName}`,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="skincareServiceId"
                  label="Service"
                  rules={[
                    { required: true, message: "Please select a service" },
                  ]}
                >
                  <Select
                    className="w-full rounded-md h-12"
                    placeholder="Select a service"
                    options={services.map((service) => ({
                      value: service.id,
                      label: `${
                        service.serviceName
                      } - ${service.price.toLocaleString()}đ`,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="skinCondition"
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
                  name="bookDate"
                  label="Booking Date"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name here",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={handleDateChange}
                    needConfirm
                    disabledDate={(current) => {
                      return current && current < moment().startOf("day");
                    }}
                    className="w-full rounded-md h-12"
                  />
                  {/* <TimePicker /> */}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item>
                  <div className="flex space-x-2 w-full rounded-md mt-[29px] ml-4">
                    {availableTimes.map((time, index) => (
                      <Button
                        key={index}
                        className={`h-12 time-option ${
                          selectedTime?.start === time.start ? "selected" : ""
                        } text-gray-700`}
                        type={
                          selectedTime?.start === time.start
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time.start} - {time.end}
                      </Button>
                    ))}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="skinType"
                  label="Your Skin Type"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                  className="mr-4"
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
                <p className="text-sm text-gray-600">
                  If you don&apos;t know your skin type, please{" "}
                  <a
                    onClick={() => navigate("/skinquiz")}
                    className="text-blue-600 "
                  >
                    Click here
                  </a>
                </p>
              </Col>

              <Col span={12}>
                <Form.Item name="allergy" label="Allergy">
                  <Input
                    className="w-full rounded-md h-12"
                    placeholder="Enter input allergy (if have)"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="image"
              label="Your Image (Face skin, product)"
              valuePropName="fileList"
              getValueFromEvent={normFile} // Keep this function to handle file list
              rules={[{ required: true, message: "Please upload an image" }]} // Validation rule
            >
              <Upload
                listType="picture"
                beforeUpload={() => false} // Prevent immediate upload
                fileList={fileList} // Bind file list state
                onChange={handleUploadChange} // Update file list state
                multiple
                accept="image/*"
                onPreview={handlePreview}
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />} className="rounded-md h-12">
                  Select Image
                </Button>
              </Upload>
            </Form.Item>

            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}

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
