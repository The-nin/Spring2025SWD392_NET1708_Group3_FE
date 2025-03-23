import { useState, useEffect } from "react";
import { instance } from "../../../service/instance";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";

const getAuthToken = () => localStorage.getItem("token");

export default function RoutineCustomer() {
  const [routines, setRoutines] = useState([]);
  const [bookingOrders, setBookingOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedDailyRoutines, setExpandedDailyRoutines] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("No authentication token found");

        const response = await instance.get("/routine/customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.result;
        console.log("Raw data from API:", JSON.stringify(data, null, 2));

        const updatedData = data.map((routine) => {
          if (routine.dailyRoutines && routine.dailyRoutines.length > 0) {
            const allDailyRoutinesDone = routine.dailyRoutines.every((dr) => {
              const status =
                dr.routineStatus || dr.routineStatusEnum || "PENDING";
              return status === "DONE";
            });
            if (allDailyRoutinesDone && routine.routineStatus !== "DONE") {
              return { ...routine, routineStatus: "DONE" };
            }
          }
          return routine;
        });

        setRoutines(updatedData);
        for (const routine of updatedData) {
          await fetchBookingOrder(routine.id);
        }
      } catch (err) {
        console.error("Error fetching routines:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load routines"
        );
        setRoutines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const fetchBookingOrder = async (routineId) => {
    try {
      const token = getAuthToken();
      const response = await instance.get(`/routine/${routineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setBookingOrders((prev) => ({
          ...prev,
          [routineId]: response.data,
        }));
      }
    } catch (err) {
      console.error(
        `Error fetching BookingOrder for routine ${routineId}:`,
        err
      );
    }
  };

  const checkAllDailyRoutinesDone = (routineId) => {
    const routine = routines.find((r) => r.id === routineId);
    if (
      !routine ||
      !routine.dailyRoutines ||
      routine.dailyRoutines.length === 0
    ) {
      return false;
    }
    return routine.dailyRoutines.every((dr) => {
      const status = dr.routineStatus || dr.routineStatusEnum || "PENDING";
      return status === "DONE";
    });
  };

  const markStepAsCompleted = async (stepId, dailyRoutineId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `http://localhost:8080/api/v1/swd392-skincare-products-sales-system/step/${stepId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || "Thất bại trong việc đánh dấu hoàn thành các bước"
        );

      setSuccess("Đánh dấu thành công!");
      const refreshedResponse = await instance.get("/routine/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(refreshedResponse.result);
    } catch (err) {
      console.error("Error marking step:", err);
      setError(
        err.message || "Thất bại trong việc đánh dấu hoàn thành các bước"
      );
    }
  };

  const markDailyRoutineAsCompleted = async (dailyRoutineId, routineId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const dailyRoutine = routines
        .flatMap((r) => r.dailyRoutines || [])
        .find((dr) => dr.id === dailyRoutineId);
      if (!dailyRoutine) throw new Error("Thói quen hằng ngày  không tìm thấy");

      const allStepsDone = (dailyRoutine.steps || []).every(
        (step) => (step.routineStatus || step.routineStatusEnum) === "DONE"
      );
      if (!allStepsDone) {
        setError(
          "Không thể hoàn thành thói quen hằng ngày vì chưa hoàn thành các bước nhỏ."
        );
        return;
      }

      if (dailyRoutine.routineStatus !== "DONE") {
        await instance.put(
          `/daily-routine/${dailyRoutineId}`,
          { routineStatus: "DONE" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setSuccess("Thói quen hằng ngày hoàn thành!");
      const refreshedResponse = await instance.get("/routine/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(refreshedResponse.result);
    } catch (err) {
      console.error("Error marking daily routine:", err);
      setError(
        err.message || "Thất bại trong việc đánh dấu thói quen hằng ngày"
      );
    }
  };

  const markRoutineAsCompleted = async (routineId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const routine = routines.find((r) => r.id === routineId);
      if (!routine) throw new Error("Chu trình không thấy");

      const response = await fetch(
        `http://localhost:8080/api/v1/swd392-skincare-products-sales-system/routine/${routineId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(Number(id)),
        }
      );

      if (!response.ok)
        throw new Error(
          (await response.json().message) ||
            "Thất bại trong việc đánh dấu chu trình"
        );

      setSuccess("Đánh dấu chu trình hoàn tất!");
      const refreshedResponse = await instance.get("/routine/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(refreshedResponse.result);
    } catch (err) {
      console.error("Error marking routine as completed:", err);
      setError(err.message || "Thất bại trong việc đánh dấu chu trình");
    }
  };

  const isToday = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date === today;
  };

  const toggleDailyRoutine = (dailyRoutineId) => {
    setExpandedDailyRoutines((prev) => ({
      ...prev,
      [dailyRoutineId]: !prev[dailyRoutineId],
    }));
  };

  const sortByStatus = (items) =>
    (items || []).sort((a, b) => {
      const statusA = a.routineStatus || a.routineStatusEnum || "PENDING";
      const statusB = b.routineStatus || b.routineStatusEnum || "PENDING";
      return statusA === "DONE" && statusB !== "DONE"
        ? 1
        : statusA !== "DONE" && statusB === "DONE"
        ? -1
        : 0;
    });

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 mb-12 bg-amber-50 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center tracking-wide">
        Chu trình chăm sóc da
      </h1>

      {loading && (
        <div className="text-center text-amber-700 animate-pulse">
          Đang tải ...
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium">
          {success}
        </div>
      )}

      {routines.length === 0 && !loading && (
        <div className="text-center text-gray-600 italic">
          Không tìm thấy chu trình nào
        </div>
      )}

      {routines.map((routine) => (
        <div
          key={routine.id}
          className="mb-8 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">
                {routine.routineName || "N/A"}
              </h2>
              <p className="text-gray-700 mb-2">
                {routine.description || "không thấy mô tả"}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Trạng thái:</span>{" "}
                {routine.routineStatus || "N/A"} |{" "}
                <span className="font-medium">Bắt đầu:</span>{" "}
                {routine.startDate
                  ? new Date(routine.startDate).toLocaleDateString()
                  : "N/A"}{" "}
                | <span className="font-medium">Kết thúc:</span>{" "}
                {routine.endDate
                  ? new Date(routine.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            {checkAllDailyRoutinesDone(routine.id) &&
              routine.routineStatus !== "DONE" && (
                <button
                  onClick={() => markRoutineAsCompleted(routine.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium"
                >
                  Cập nhật trạng thái chu trình
                </button>
              )}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-medium text-amber-700 mb-3">
              Chu trình thói quen hằng ngày
            </h3>
            {(routine.dailyRoutines || []).map((dailyRoutine) => (
              <div
                key={dailyRoutine.id}
                className="mb-4 border border-amber-200 rounded-lg overflow-hidden"
              >
                <div className="flex justify-between items-center w-full p-4 bg-amber-100 text-left text-gray-700 font-medium hover:bg-amber-200 transition duration-200">
                  <button
                    onClick={() => toggleDailyRoutine(dailyRoutine.id)}
                    className="flex-1 text-left"
                  >
                    Ngày thực hiện:{" "}
                    {dailyRoutine.date
                      ? new Date(dailyRoutine.date).toLocaleDateString()
                      : "N/A"}{" "}
                    | Trạng thái: {dailyRoutine.routineStatus || "Unknown"}
                  </button>
                  <div className="flex items-center gap-2">
                    {isToday(dailyRoutine.date) &&
                      dailyRoutine.routineStatus !== "DONE" && (
                        <button
                          onClick={() =>
                            markDailyRoutineAsCompleted(
                              dailyRoutine.id,
                              routine.id
                            )
                          }
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200 text-sm font-medium"
                        >
                          Hoàn thành
                        </button>
                      )}
                    <span
                      onClick={() => toggleDailyRoutine(dailyRoutine.id)}
                      className="text-amber-600 cursor-pointer"
                    >
                      {expandedDailyRoutines[dailyRoutine.id] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  </div>
                </div>

                {expandedDailyRoutines[dailyRoutine.id] && (
                  <div className="p-4 bg-amber-50">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      Các bước:
                    </h4>
                    {!dailyRoutine.steps || dailyRoutine.steps.length === 0 ? (
                      <p className="text-gray-600 italic">
                        Không tìm thấy các bước
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {sortByStatus(dailyRoutine.steps).map((step) => (
                          <li
                            key={step.id}
                            className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition duration-200"
                          >
                            <div>
                              <p className="text-gray-800">
                                <span className="font-medium">
                                  Bước {step.stepNumber || "N/A"}:
                                </span>{" "}
                                {step.action || "N/A"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {step.description || "N/A"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Buổi: {step.timeOfDay || "N/A"} | Trạng thái:{" "}
                                <span
                                  className={
                                    (step.routineStatus ||
                                      step.routineStatusEnum) === "DONE"
                                      ? "text-green-600 font-medium"
                                      : "text-red-600 font-medium"
                                  }
                                >
                                  {step.routineStatus ||
                                    step.routineStatusEnum ||
                                    "PENDING"}
                                </span>
                              </p>
                              {step.product && (
                                <p className="text-gray-500 text-sm">
                                  Sản phẩm: {step.product.name || "N/A"}
                                </p>
                              )}
                            </div>
                            {(step.routineStatus || step.routineStatusEnum) !==
                              "DONE" && (
                              <button
                                onClick={() =>
                                  markStepAsCompleted(step.id, dailyRoutine.id)
                                }
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200 text-sm font-medium"
                              >
                                Hoàn thành
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
