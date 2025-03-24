import {
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  Spin,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { getBookingById, updateStatus } from "../../../service/booking";

function ConsultantOrderDetail() {
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [image, setImage] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { id } = useParams();

  const statusVisibleRoutine = ["PENDING", "PAYMENT", "ASSIGNED_EXPERT"];

  const transSkintype = (skinType) => {
    switch (skinType) {
      case "NORMAL_SKIN":
        return "Da thường";
      case "OILY_SKIN":
        return "Da dầu";
      case "SENSITIVE_SKIN":
        return "Da nhạy cảm";
      case "DRY_SKIN":
        return "Da khô";
      case "COMBINATION_SKIN":
        return "Da hỗn hợp";
    }
  };

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getBookingById(id);
      if (!response) {
        throw new Error("Có lỗi trong việc tải dữ liệu đơn hàng");
      }
      setOrderDetail(response.bookingOrder);
      const imageUrls = response.imageSkin.map((img) => img.image);
      setImage(imageUrls);
    } catch (error) {
      toast.error("Lỗi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (value) => {
    try {
      console.log("value", value);
      setLoading(true);

      const status = "CONTACT_CUSTOMER";
      const formData = {
        status: status,
        response: value.response,
      };

      const result = await updateStatus(id, formData);

      if (result && result.data) {
        toast.success("Hoàn tất gửi nhận xét");
        await fetchOrderDetail();
        form.resetFields();
      }
    } catch (error) {
      toast.error("có lỗi trong việc gửi nhận xét", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderDetail) {
    return <div>Không có lịch nào được đặt</div>;
  }

  return (
    <div className="p-6">
      <div className="flex item-center mb-6">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate("/admin/consultant-booking")}
        >
          Quay lại
        </Button>
        <h2 className="text-2xl font-bold ml-3">Chi tiết đơn tư vấn</h2>
      </div>

      <Card className="mb-6">
        <Descriptions title="Thông tin đơn hàng" bordered>
          <Descriptions.Item label="Mã đơn">{orderDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {orderDetail.price.toLocaleString() || "N/A"} VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt đơn">
            {new Date(orderDetail.date).toLocaleString() || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            <Tag color={orderDetail.paymentStatus === "PAID" ? "green" : "red"}>
              {orderDetail.paymentStatus || "Chưa thanh toán"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái đơn">
            {orderDetail.status}
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin đơn hàng" span={3}>
            Ngày gặp mặt: {new Date(orderDetail.orderDate).toLocaleString()}{" "}
            <br />
            Dịch vụ: {orderDetail.serviceName || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-6">
        <Descriptions title="Thông tin khách hàng" bordered>
          <Descriptions.Item label="Họ tên khách hàng">
            {orderDetail.lastName} {orderDetail.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Độ tuổi">
            {orderDetail.age || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Loại da">
            {transSkintype(orderDetail.skinType) || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Dị ứng">
            {orderDetail.allergy || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {orderDetail.skinCondition}
          </Descriptions.Item>
        </Descriptions>

        <div>
          <div className="overflow-hidden whitespace-nowrap text-ellipsis flex-auto text-black text-opacity-88 font-semibold text-md leading-6 my-5">
            HÌnh ảnh da, sản phẩm của khách hàng
          </div>
          {image &&
            image.length > 0 &&
            image.map((item, index) => (
              <div key={index} className="inline-block mr-3">
                <Image src={item} alt="image" width={100} height={100} />
              </div>
            ))}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="overflow-hidden whitespace-nowrap text-ellipsis flex-auto text-black text-opacity-88 font-semibold text-md leading-6 mb-5">
          Nhận xét/ Tư vấn
        </div>

        {orderDetail.response ? (
          <>
            <Descriptions>
              <Descriptions.Item label="Họ tên khách Phản hòi khách hàng">
                {orderDetail.response}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <>
            <Form
              form={form}
              onFinish={handleChangeStatus}
              autoComplete="off"
              className="space-y-6"
            >
              {orderDetail.paymentStatus === "PAID" ? (
                <>
                  <Form.Item name="response">
                    <Input.TextArea rows={4} placeholder="Nhập nhận xét" />
                  </Form.Item>
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
                </>
              ) : (
                <div className="mt-6 text-red-500">
                  Khách hàng chưa thanh toán chưa thể đưa nhận xét
                </div>
              )}
            </Form>
          </>
        )}
      </Card>

      {orderDetail.routine ? (
        <>
          <Card className="mb-6">
            <Descriptions title="Thông tin chu trình" bordered>
              <Descriptions.Item label="ID">{orderDetail.id}</Descriptions.Item>
              <Descriptions.Item label="Tên chu trình">
                {orderDetail.routine.routineName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả chu trình">
                {orderDetail.routine.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {orderDetail.routine.routineStatus}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      ) : (
        <>
          {!statusVisibleRoutine.includes(orderDetail.status) && (
            <Button
              onClick={() =>
                navigate(
                  `/admin/consultant-booking/order-detail/${id}/new-routine`
                )
              }
            >
              Lên lịch trình chăm da
            </Button>
          )}
        </>
      )}

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
    </div>
  );
}

export default ConsultantOrderDetail;
