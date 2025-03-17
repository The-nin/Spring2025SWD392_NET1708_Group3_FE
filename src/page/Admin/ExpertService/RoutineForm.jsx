import { useState, useEffect } from "react";
import { instance } from "../../../service/instance";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const getAuthToken = () => localStorage.getItem("token");

export default function RoutineForm() {
  const [formData, setFormData] = useState({
    description: "",
    routineName: "",
    startDate: "",
    endDate: "",
    bookingOrderId: "",
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
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const token = getAuthToken();
        if (!token)
          throw new Error("No authentication token found. Please log in.");
        const response = await instance.get("/routine/get-product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.result;
        console.log("Product response:", data);
        const productData = Array.isArray(data.result)
          ? data.result
          : data.data || data || [];
        setProducts(productData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products"
        );
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (window.confirm("Are you sure you want to remove this daily routine?")) {
      setFormData((prev) => ({
        ...prev,
        dailyRoutines: prev.dailyRoutines.filter((_, i) => i !== dailyIndex),
      }));
    }
  };

  const handleDailyRoutineChange = (index, field, value) => {
    setFormData((prev) => {
      const newDailyRoutines = [...prev.dailyRoutines];
      newDailyRoutines[index] = { ...newDailyRoutines[index], [field]: value };
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
    if (window.confirm("Are you sure you want to remove this step?")) {
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
      !formData.routineName ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("Please fill in all required fields");

      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date");
      return false;
    }
    if (formData.dailyRoutines.length === 0) {
      setError("Please add at least one daily routine");
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
        "All daily routines must have a date and at least one step with required fields completed"
      );
      return false;
    }
    return true;
  };

  // const [bookingOrderId, setBookingOrderId] = useState(id);

  // useEffect(() => {
  //   setBookingOrderId(id);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const requestData = {
      description: formData.description,
      routineName: formData.routineName,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      dailyRoutines: formData.dailyRoutines.map((daily) => ({
        date: new Date(daily.date).toISOString().split("T")[0],
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
      console.log("Submitting routine:", JSON.stringify(requestData, null, 2));
      const token = getAuthToken();
      if (!token)
        throw new Error("No authentication token found. Please log in.");

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
      console.log("Submit response:", JSON.stringify(data, null, 2));

      if (!response.ok)
        throw new Error(data.message || "Failed to create routine");

      setSuccess(data.message || "Routine created successfully!");
      setFormData({
        description: "",
        routineName: "",
        startDate: "",
        endDate: "",
        // bookingOrderId: "",
        dailyRoutines: [],
      });
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessages = {
        UNAUTHENTICATED: "Please login to create a routine",
        BOOKING_NOT_EXIST: "Booking order not found",
        PRODUCT_NOT_EXISTED: "One or more products not found",
      };
      setError(
        errorMessages[err.message] || err.message || "Failed to create routine"
      );
    } finally {
      setSubmitting(false);
    }
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
          Create a New Routine
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
                Booking Order ID: {id}
              </label>
              {/* <input
              type="number"
              name="bookingOrderId"
              value={formData.bookingOrderId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
              disabled={submitting}
            /> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="routineName"
                value={formData.routineName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows="4"
              required
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Daily Routines
              </h2>
              <button
                type="button"
                onClick={addDailyRoutine}
                disabled={submitting}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                + Add Daily Routine
              </button>
            </div>

            {formData.dailyRoutines.map((dailyRoutine, dailyIndex) => (
              <div
                key={dailyIndex}
                className="mb-6 p-6 bg-amber-50 rounded-xl shadow-sm border border-amber-200"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dailyRoutine.date}
                      onChange={(e) =>
                        handleDailyRoutineChange(
                          dailyIndex,
                          "date",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700">Steps</h3>
                    <button
                      type="button"
                      onClick={() => addStep(dailyIndex)}
                      disabled={submitting}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      + Add Step
                    </button>
                  </div>

                  {dailyRoutine.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Step Number <span className="text-red-500">*</span>
                          </label>
                          <input
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time of Day
                          </label>
                          <select
                            value={step.timeOfDay}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "timeOfDay",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            disabled={submitting}
                          >
                            <option value="">Select Time</option>
                            <option value="MORNING">Morning</option>
                            <option value="AFTERNOON">Afternoon</option>
                            <option value="EVENING">Evening</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={step.action}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "action",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                          </label>
                          <input
                            type="text"
                            value={step.note}
                            onChange={(e) =>
                              handleStepChange(
                                dailyIndex,
                                stepIndex,
                                "note",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product
                          </label>
                          {loadingProducts ? (
                            <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                              Loading products...
                            </div>
                          ) : (
                            <select
                              value={step.productId}
                              onChange={(e) =>
                                handleStepChange(
                                  dailyIndex,
                                  stepIndex,
                                  "productId",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              disabled={submitting}
                            >
                              <option value="">Select Product</option>
                              {products.length > 0 ? (
                                products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name || `Product ${product.id}`}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No products available
                                </option>
                              )}
                            </select>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStep(dailyIndex, stepIndex)}
                        disabled={submitting}
                        className="mt-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Remove Step
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => removeDailyRoutine(dailyIndex)}
                  disabled={submitting}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Remove Daily Routine
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting || loadingProducts}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                submitting || loadingProducts
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {submitting ? "Submitting..." : "Create Routine"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
