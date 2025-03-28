import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  createBooking,
  createPayment,
  getAllExperts,
} from "../../service/booking";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../service/productManagement";
// import { set } from "date-fns";
import { getServices } from "../../service/serviceManagement";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../service/profile";

function Consultant() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [tempBookingData, setTempBookingData] = useState(null);
  const [expertName, setExpertName] = useState([]);
  const [user, setUser] = useState([]);

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

  const fetchUser = async () => {
    try {
      const response = await getProfile();
      if (response && response.result) {
        setUser(response.result);
        form.setFieldsValue({
          firstName: response.result.firstName,
          lastName: response.result.lastName,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      setLoading(true);
      const imageFiles = values.image.map((fileObj) => fileObj.originFileObj);
      const imageURLs = await Promise.all(
        imageFiles.map(async (file) => await uploadToCloudinary(file))
      );

      // const localOffset = moment().format("Z");
      // const formateAge = values.age.format(
      //   `YYYY-MM-DD[T00:00:00]${localOffset}`
      // ); // Giờ địa phương
      // const formateBookDate = values.bookDate.format(
      //   `YYYY-MM-DDTHH:mm:ss${localOffset}`
      // );

      const formateAge = values.age.format("YYYY-MM-DD[T00:00:00]"); // "2000-03-26T00:00:00"
      const formateBookDate = values.bookDate.format("YYYY-MM-DDTHH:mm:ss");

      const bookingData = {
        firstName: values.firstName,
        lastName: values.lastName,
        skinType: values.skinType,
        skinCondition: values.skinCondition,
        allergy: values.allergy || "",
        bookDate: formateBookDate,
        expertId: values.expertId || "",
        age: formateAge,
        note: values.note || "",
        skincareServiceId: values.skincareServiceId,
        imageSkins: imageURLs.map((url) => ({ image: url })),
      };

      setTempBookingData(bookingData);

      setOpenModalPayment(true);
    } catch (error) {
      console.error("Failed to prepare booking:", error);
      toast.error("Có lỗi xảy ra khi chuẩn bị dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleLater = async () => {
    try {
      setLoading(true);

      const response = await createBooking(tempBookingData);

      if (response) {
        toast.success("Đặt lịch thành công (chờ thanh toán)");
        form.resetFields();
        setFileList([]);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error("Thất bại trong việc đặt lịch");
    } finally {
      setLoading(false);
      setOpenModalPayment(false);
      setTempBookingData(null);
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

  const handlePayment = async () => {
    try {
      setLoading(true);

      const book = await createBooking(tempBookingData);
      console.log(book.result);

      const bookingId = book.result.bookingOrderId;

      const response = await createPayment(bookingId);

      console.log("Payment Response:", response);

      const redirectUrl = response.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("Không lấy được URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    } finally {
      setLoading(false);
    }
  };

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
              Thông tin về da của bạn
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
                  name="lastName"
                  label="Họ"
                  rules={[
                    {
                      required: true,
                      message: "Bạn phải điền họ của mình vào ô này",
                    },
                    {
                      min: 1,
                      message: "Họ của bạn cần tối thiểu 1 ký tự",
                    },
                  ]}
                  className="mr-4"
                >
                  <Input
                    placeholder="Nhập họ của bạn"
                    className="rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[
                    {
                      required: true,
                      message: "Bạn phải điền tên của mình vào ô này",
                    },
                    {
                      min: 1,
                      message: "Tên của bạn cần tối thiểu 1 ký tự",
                    },
                  ]}
                  className="mr-4"
                >
                  <Input
                    placeholder="Nhập tên của bạn"
                    className="rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item
                  name="age"
                  label="Tuổi"
                  rules={[
                    { required: true, message: "Bạn cần phải nhập độ tuổi" },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập độ tuổi của bạn"
                    className="w-full rounded-md h-12"
                  />
                </Form.Item>
              </Col> */}
              <Col span={8}>
                <Form.Item
                  name="age"
                  label="Năm sinh"
                  rules={[
                    { required: true, message: "Bạn cần phải nhập năm sinh" },
                  ]}
                >
                  <DatePicker
                    placeholder="Nhập năm sinh"
                    picker="year"
                    className="w-full rounded-md h-12"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="expertId"
                  label="Chọn tư vấn viên"
                  className="mr-4"
                >
                  <Select
                    className="w-full rounded-md h-12"
                    placeholder="Tư vấn viên"
                    options={
                      experts && experts.length > 0
                        ? experts.map((expert) => ({
                            value: expert.id,
                            label: `${expert.lastName} ${expert.firstName}`,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="skincareServiceId"
                  label="Dịch vụ"
                  rules={[{ required: true, message: "Hãy lựa chọn dịch vụ" }]}
                >
                  <Select
                    className="w-full rounded-md h-12"
                    placeholder="Lựa chọn loại dịch vụ"
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
              label="Mô tả của bạn"
              rules={[
                {
                  required: true,
                  message: "Bạn phải nhập mô tả của bạn ở đây",
                },
                {
                  min: 10,
                  message: "Mô tả cần ít nhất 10 ký tự",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả ở đây"
                maxLength={500}
                showCount
                className="rounded-md"
              />
            </Form.Item>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="bookDate"
                  label="Ngày đặt lịch"
                  rules={[
                    {
                      required: true,
                      message: "Hẫy chọn ngày bạn muốn tư vấn",
                    },
                  ]}
                  className="mr-4"
                >
                  <DatePicker
                    placeholder="Chọn ngày"
                    onChange={handleDateChange}
                    showTime
                    disabledDate={(current) => {
                      return current && current < moment().startOf("day");
                    }}
                    className="w-full rounded-md h-12"
                  />
                </Form.Item>
              </Col>

              {/* <Col span={12}>
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
              </Col> */}

              <Col span={12}>
                <Form.Item name="allergy" label="Dị ứng">
                  <Input
                    className="w-full rounded-md h-12"
                    placeholder="Nhập loại di ứng(nếu có)"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item
                  name="skinType"
                  label="Loại da của bạn"
                  rules={[
                    {
                      required: true,
                      message: "Bạn phải nhập loại da của bạn",
                    },
                  ]}
                  // className="mr-4"
                >
                  <Select
                    placeholder="Lựa chọn loại da"
                    className="w-full rounded-md h-12"
                  >
                    <Select.Option value="NORMAL_SKIN">Da thường</Select.Option>
                    <Select.Option value="OILY_SKIN">Da dầu</Select.Option>
                    <Select.Option value="SENSITIVE_SKIN">
                      Da nhạy cảm
                    </Select.Option>
                    <Select.Option value="DRY_SKIN">Da khô</Select.Option>
                    <Select.Option value="COMBINATION_SKIN">
                      Da hỗn hợp
                    </Select.Option>
                  </Select>
                </Form.Item>
                <p className="text-sm text-gray-600">
                  Nêu bạn chưa biết mình thuộc kiểu da nào, bấm{" "}
                  <a
                    onClick={() => navigate("/skinquiz")}
                    className="text-blue-600 "
                  >
                    Ở ĐÂY
                  </a>
                </p>
              </Col>

              {/* <Col span={12}>
                <Form.Item name="allergy" label="Dị ứng">
                  <Input
                    className="w-full rounded-md h-12"
                    placeholder="Nhập loại di ứng(nếu có)"
                  />
                </Form.Item>
              </Col> */}
            </Row>

            <Form.Item
              name="image"
              label="Hình ảnh( da mặt, sản phẩm)"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Bạn phải gửi ảnh" }]}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                multiple
                accept="image/*"
                onPreview={handlePreview}
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />} className="rounded-md h-12">
                  Chọn ảnh
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
                Gửi
              </Button>
            </Form.Item>
          </Form>

          <Modal
            onCancel={() => setOpenModalPayment(false)}
            open={openModalPayment}
            footer={null}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Bạn cần thanh toán để hoàn tất đặt lịch
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn có thể thanh toán sau, kiểm tra mục lịch sử đặt lịch tư vấn
                trong trang cá nhân.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleLater}
                  loading={loading}
                  className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                  Lúc khác
                </Button>
                <Button
                  onClick={handlePayment}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Thanh Toán
                </Button>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    </>
  );
}

export default Consultant;
