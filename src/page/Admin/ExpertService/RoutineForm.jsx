import { useState, useEffect } from "react";
import { instance } from "../../../service/instance";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Input, Select } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const { TextArea } = Input;
const { Option } = Select;

const getAuthToken = () => localStorage.getItem("token");

export default function RoutineForm() {
  const [formData, setFormData] = useState({
    bookingOrderId: "",
    description: "",
    routineName: "",
    routineStatus: "DONE",
    startDate: "",
    endDate: "",
    dailyRoutines: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, bookingOrderId: id }));
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const token = getAuthToken();
        if (!token)
          throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");
        const response = await instance.get("/routine/get-product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.result;
        const productData = Array.isArray(data.result)
          ? data.result
          : data.data || data || [];
        setProducts(productData);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError(
          err.response?.data?.message || err.message || "Không thể tải sản phẩm"
        );
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? dayjs(date).format("YYYY-MM-DD") : "",
    }));
  };

  const addDailyRoutine = () => {
    setFormData((prev) => ({
      ...prev,
      dailyRoutines: [
        ...prev.dailyRoutines,
        {
          date: "",
          steps: [
            {
              stepNumber: 1,
              timeOfDay: "MORNING",
              action: "",
              description: "",
              note: "",
              productId: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDailyRoutine = (dailyIndex) => {
    if (window.confirm("Bạn có chắc muốn xóa thói quen hàng ngày này không?")) {
      setFormData((prev) => ({
        ...prev,
        dailyRoutines: prev.dailyRoutines.filter((_, i) => i !== dailyIndex),
      }));
    }
  };

  const handleDailyRoutineChange = (index, field, value) => {
    setFormData((prev) => {
      const newDailyRoutines = [...prev.dailyRoutines];
      newDailyRoutines[index] = {
        ...newDailyRoutines[index],
        [field]:
          field === "date" && value ? dayjs(value).format("YYYY-MM-DD") : value,
      };
      return { ...prev, dailyRoutines: newDailyRoutines };
    });
  };

  const addStep = (dailyRoutineIndex) => {
    setFormData((prev) => {
      const newDailyRoutines = [...prev.dailyRoutines];
      newDailyRoutines[dailyRoutineIndex].steps.push({
        stepNumber: newDailyRoutines[dailyRoutineIndex].steps.length + 1,
        timeOfDay: "MORNING",
        action: "",
        description: "",
        note: "",
        productId: "",
      });
      return { ...prev, dailyRoutines: newDailyRoutines };
    });
  };

  const removeStep = (dailyRoutineIndex, stepIndex) => {
    if (window.confirm("Bạn có chắc muốn xóa bước này không?")) {
      setFormData((prev) => {
        const newDailyRoutines = [...prev.dailyRoutines];
        newDailyRoutines[dailyRoutineIndex].steps = newDailyRoutines[
          dailyRoutineIndex
        ].steps.filter((_, i) => i !== stepIndex);
        return { ...prev, dailyRoutines: newDailyRoutines };
      });
    }
  };

  const handleStepChange = (dailyRoutineIndex, stepIndex, field, value) => {
    setFormData((prev) => {
      const newDailyRoutines = [...prev.dailyRoutines];
      newDailyRoutines[dailyRoutineIndex].steps[stepIndex] = {
        ...newDailyRoutines[dailyRoutineIndex].steps[stepIndex],
        [field]: field === "stepNumber" ? parseInt(value) || 1 : value,
      };
      return { ...prev, dailyRoutines: newDailyRoutines };
    });
  };

  const validateForm = () => {
    if (
      !formData.bookingOrderId ||
      !formData.routineName ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }
    if (formData.dailyRoutines.length === 0) {
      setError("Vui lòng thêm ít nhất một thói quen hàng ngày");
      return false;
    }
    if (
      formData.dailyRoutines.some(
        (dr) =>
          !dr.date ||
          dr.steps.length === 0 ||
          dr.steps.some(
            (step) => !step.stepNumber || !step.action || !step.description
          )
      )
    ) {
      setError(
        "Tất cả thói quen hàng ngày phải có ngày và ít nhất một bước với các trường bắt buộc được điền đầy đủ"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const toISODate = (dateString) => {
      return dayjs(dateString).startOf("day").toISOString();
    };

    const requestData = {
      bookingOrderId: parseInt(formData.bookingOrderId),
      description: formData.description,
      routineName: formData.routineName,
      routineStatus: formData.routineStatus,
      startDate: toISODate(formData.startDate),
      endDate: toISODate(formData.endDate),
      dailyRoutines: formData.dailyRoutines.map((daily) => ({
        date: daily.date, // Đảm bảo định dạng phù hợp với backend
        steps: daily.steps.map((step) => ({
          stepNumber: step.stepNumber,
          timeOfDay: step.timeOfDay || null,
          action: step.action,
          description: step.description,
          note: step.note || null,
          productId: step.productId ? step.productId : null,
        })),
      })),
    };

    try {
      console.log("Đang gửi thói quen:", JSON.stringify(requestData, null, 2));
      const token = getAuthToken();
      if (!token)
        throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");

      const response = await fetch(
        `http://localhost:8080/api/v1/swd392-skincare-products-sales-system/routine/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("Kết quả gửi:", JSON.stringify(data, null, 2));

      if (!response.ok)
        throw new Error(data.message || "Không thể tạo thói quen");

      setSuccess(data.message || "Thói quen đã được tạo thành công!");
      setFormData({
        bookingOrderId: id,
        description: "",
        routineName: "",
        routineStatus: "DONE",
        startDate: "",
        endDate: "",
        dailyRoutines: [],
      });
      navigate(`/admin/consultant-booking/order-detail/${id}`);
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      const errorMessages = {
        UNAUTHENTICATED: "Vui lòng đăng nhập để tạo thói quen",
        BOOKING_NOT_EXIST: "Đơn đặt hàng không tồn tại",
        PRODUCT_NOT_EXISTED: "Một hoặc nhiều sản phẩm không tồn tại",
      };
      setError(
        errorMessages[err.message] || err.message || "Không thể tạo thói quen"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate(`/admin/consultant-booking/order-detail/${id}`)}
        className="mx-10 my-10"
      >
        Quay lại
      </Button>
      <div className="max-w-4xl mx-auto mt-2 p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Tạo Thói Quen Mới
        </h1>

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã Đơn Đặt Hàng: {id}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Thói Quen <span className="text-red-500">*</span>
              </label>
              <Input
                name="routineName"
                value={formData.routineName}
                onChange={handleChange}
                className="w-full"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả <span className="text-red-500">*</span>
            </label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full"
              required
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Bắt Đầu <span className="text-red-500">*</span>
              </label>
              <DatePicker
                format="YYYY-MM-DD"
                value={formData.startDate ? dayjs(formData.startDate) : null}
                onChange={(date) => handleDateChange("startDate", date)}
                className="w-full"
                disabled={submitting}
                disabledDate={disabledDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Kết Thúc <span className="text-red-500">*</span>
              </label>
              <DatePicker
                format="YYYY-MM-DD"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(date) => handleDateChange("endDate", date)}
                className="w-full"
                disabled={submitting}
                disabledDate={disabledDate}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Thói Quen Hàng Ngày
              </h2>
              <Button
                type="primary"
                onClick={addDailyRoutine}
                disabled={submitting}
                className="bg-amber-600 hover:bg-amber-700"
              >
                + Thêm Thói Quen Hàng Ngày
              </Button>
            </div>

            {formData.dailyRoutines.map((dailyRoutine, dailyIndex) => (
              <div
                key={dailyIndex}
                className="mb-6 p-6 bg-amber-50 rounded-xl shadow-sm border border-amber-200"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      format="YYYY-MM-DD"
                      value={
                        dailyRoutine.date ? dayjs(dailyRoutine.date) : null
                      }
                      onChange={(date) =>
                        handleDailyRoutineChange(dailyIndex, "date", date)
                      }
                      className="w-full"
                      disabled={submitting}
                      disabledDate={disabledDate}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700">
                      Các Bước
                    </h3>
                    <Button
                      type="primary"
                      onClick={() => addStep(dailyIndex)}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      + Thêm Bước
                    </Button>
                  </div>

                  {dailyRoutine.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số Thứ Tự Bước{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={step.stepNumber}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "stepNumber",
                                e.target.value
                              )
                            }
                            className="w-full"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời Gian Trong Ngày
                          </label>
                          <Select
                            value={step.timeOfDay}
                            onChange={(value) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "timeOfDay",
                                value
                              )
                            }
                            className="w-full"
                            disabled={submitting}
                          >
                            <Option value="">Chọn Thời Gian</Option>
                            <Option value="MORNING">Sáng</Option>
                            <Option value="AFTERNOON">Chiều</Option>
                            <Option value="EVENING">Tối</Option>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hành Động <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={step.action}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "action",
                                e.target.value
                              )
                            }
                            className="w-full"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô Tả <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={step.description}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi Chú
                          </label>
                          <Input
                            value={step.note}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "note",
                                e.target.value
                              )
                            }
                            className="w-full"
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sản Phẩm
                          </label>
                          {loadingProducts ? (
                            <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                              Đang tải sản phẩm...
                            </div>
                          ) : (
                            <Select
                              value={step.productId}
                              onChange={(value) =>
                                handleStepChange(
                                  dailyIndex,
                                  stepIndex,
                                  "productId",
                                  value
                                )
                              }
                              className="w-full"
                              disabled={submitting}
                            >
                              <Option value="">Chọn Sản Phẩm</Option>
                              {products.length > 0 ? (
                                products.map((product) => (
                                  <Option key={product.id} value={product.id}>
                                    {product.name || `Sản phẩm ${product.id}`}
                                  </Option>
                                ))
                              ) : (
                                <Option value="" disabled>
                                  Không có sản phẩm nào
                                </Option>
                              )}
                            </Select>
                          )}
                        </div>
                      </div>
                      <Button
                        type="danger"
                        onClick={() => removeStep(dailyIndex, stepIndex)}
                        disabled={submitting}
                        className="mt-4 bg-red-600 hover:bg-red-700"
                      >
                        Xóa Bước
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="danger"
                  onClick={() => removeDailyRoutine(dailyIndex)}
                  disabled={submitting}
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Xóa Thói Quen Hàng Ngày
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              type="primary"
              htmlType="submit"
              disabled={submitting || loadingProducts}
              className={`w-full ${
                submitting || loadingProducts
                  ? "bg-gray-400"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {submitting ? "Đang Gửi..." : "Tạo Thói Quen"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
