import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { instance } from "../../../service/instance";

const getAuthToken = () => localStorage.getItem("token");

export default function RoutineCustomer() {
  const [routines, setRoutines] = useState([]);
  const [bookingOrders, setBookingOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedDailyRoutines, setExpandedDailyRoutines] = useState({});

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
        console.log("Fetched routines:", JSON.stringify(data, null, 2));

        const updatedData = data.map((routine) => {
          if (routine.dailyRoutines && routine.dailyRoutines.length > 0) {
            const allDailyRoutinesDone = routine.dailyRoutines.every((dr) => {
              const status =
                dr.routineStatus || dr.routineStatusEnum || "PENDING";
              console.log(`Checking dailyRoutine ${dr.id} status: ${status}`);
              return status === "DONE";
            });
            if (allDailyRoutinesDone && routine.routineStatus !== "DONE") {
              console.log(
                `Routine ${routine.id} should be DONE, updating to DONE`
              );
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

  useEffect(() => {
    console.log("Current routines state:", JSON.stringify(routines, null, 2));
  }, [routines]);

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
        console.log(`BookingOrder for routine ${routineId}:`, response.data);
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
      console.log(`Routine ${routineId} not found or has no dailyRoutines`);
      return false;
    }
    const allDone = routine.dailyRoutines.every((dr) => {
      const status = dr.routineStatus || dr.routineStatusEnum || "PENDING";
      console.log(`DailyRoutine ${dr.id} status: ${status}`);
      return status === "DONE";
    });
    console.log(`All dailyRoutines in routine ${routineId} done: ${allDone}`);
    console.log();
    return allDone;
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
      console.log(routines);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to mark step as completed");

      setSuccess("Step marked as completed!");
      setRoutines((prev) =>
        prev.map((routine) => ({
          ...routine,
          dailyRoutines: (routine.dailyRoutines || []).map((dr) => {
            if (dr.id === dailyRoutineId) {
              const updatedSteps = (dr.steps || []).map((step) =>
                step.id === stepId
                  ? {
                      ...step,
                      routineStatus: "DONE",
                      lastCompletedDate: new Date().toISOString().split("T")[0],
                    }
                  : step
              );
              const allStepsDone = updatedSteps.every(
                (step) =>
                  (step.routineStatus || step.routineStatusEnum) === "DONE"
              );
              if (allStepsDone) {
                console.log(
                  `All steps done for dailyRoutine ${dr.id}, marking as completed...`
                );
                setTimeout(
                  () => markDailyRoutineAsCompleted(dr.id, routine.id),
                  0
                );
              }
              return {
                ...dr,
                steps: sortByStatus(updatedSteps),
                routineStatus: allStepsDone ? "DONE" : dr.routineStatus,
              };
            }
            return dr;
          }),
        }))
      );
    } catch (err) {
      console.error("Error marking step:", err);
      setError(err.message || "Failed to mark step as completed");
    }
  };

  const markDailyRoutineAsCompleted = async (dailyRoutineId, routineId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const dailyRoutine = routines
        .flatMap((r) => r.dailyRoutines || [])
        .find((dr) => dr.id === dailyRoutineId);

      if (!dailyRoutine) throw new Error("Daily routine not found");

      const allStepsDone = (dailyRoutine.steps || []).every(
        (step) => (step.routineStatus || step.routineStatusEnum) === "DONE"
      );

      if (!allStepsDone) {
        setError("Cannot complete daily routine: Not all steps are done yet.");
        return;
      }

      if (dailyRoutine.routineStatus !== "DONE") {
        console.log(`Marking dailyRoutine ${dailyRoutineId} as DONE`);
        const response = await instance.put(
          `/daily-routine/${dailyRoutineId}`,
          { routineStatus: "DONE" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to mark daily routine as completed");
        }
      } else {
        console.log(
          `DailyRoutine ${dailyRoutineId} already DONE, skipping API call`
        );
      }

      setSuccess("Daily routine marked as completed!");
      setRoutines((prev) => {
        const updatedRoutines = prev.map((routine) => {
          if (routine.id === routineId) {
            const updatedDailyRoutines = (routine.dailyRoutines || []).map(
              (dr) =>
                dr.id === dailyRoutineId ? { ...dr, routineStatus: "DONE" } : dr
            );
            const allDailyRoutinesDone = checkAllDailyRoutinesDone(routineId);

            if (allDailyRoutinesDone && routine.routineStatus !== "DONE") {
              console.log(
                `All dailyRoutines in routine ${routineId} are DONE, updating routine to DONE`
              );
              return {
                ...routine,
                dailyRoutines: updatedDailyRoutines,
                routineStatus: "DONE",
              };
            }
            return {
              ...routine,
              dailyRoutines: updatedDailyRoutines,
            };
          }
          return routine;
        });

        console.log(
          "Updated routines before return:",
          JSON.stringify(updatedRoutines, null, 2)
        );
        return updatedRoutines;
      });
    } catch (err) {
      console.error("Error marking daily routine:", err);
      setError(err.message || "Failed to mark daily routine as completed");
    }
  };

  const markRoutineAsCompleted = async (routineId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const routine = routines.find((r) => r.id === routineId);
      if (!routine) throw new Error("Routine not found");

      console.log(`Calling API to mark routine ${routineId} as DONE`);
      const response = await fetch(
        `http://localhost:8080/api/v1/swd392-skincare-products-sales-system/routine/${routineId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingOrderId: routine.bookingOrderId,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error for markRoutineAsCompleted:", errorData);
        throw new Error(
          `Failed to mark routine as completed: ${
            errorData.message || response.statusText
          }`
        );
      }

      console.log(`Routine ${routineId} marked as completed successfully`);
      setSuccess("Routine marked as completed!");

      setBookingOrders((prev) => ({
        ...prev,
        [routineId]: {
          ...prev[routineId],
          status: "FINISHED_ROUTINE",
        },
      }));

      const refreshedResponse = await instance.get("/routine/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = refreshedResponse.result;
      console.log("Refreshed routines:", JSON.stringify(updatedData, null, 2));
      setRoutines(updatedData);
    } catch (err) {
      console.error("Error marking routine as completed:", err);
      setError(err.message || "Failed to mark routine as completed");
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
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-amber-50 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center tracking-wide">
        My Routines
      </h1>

      {loading && (
        <div className="text-center text-amber-700 animate-pulse">
          Loading your routines...
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
          No routines found.
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
                {routine.routineName || "Unnamed Routine"}
              </h2>
              <p className="text-gray-700 mb-2">
                {routine.description || "No description"}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Status:</span>{" "}
                {routine.routineStatus || "Unknown"} |{" "}
                <span className="font-medium">Start:</span>{" "}
                {routine.startDate
                  ? new Date(routine.startDate).toLocaleDateString()
                  : "N/A"}{" "}
                | <span className="font-medium">End:</span>{" "}
                {routine.endDate
                  ? new Date(routine.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            {/* Nút Update Routine Status */}
            {checkAllDailyRoutinesDone(routine.id) &&
              routine.routineStatus !== "DONE" && (
                <button
                  onClick={() => markRoutineAsCompleted(routine.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium"
                >
                  Update Routine Status
                </button>
              )}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-medium text-amber-700 mb-3">
              Daily Routines
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
                    Date:{" "}
                    {dailyRoutine.date
                      ? new Date(dailyRoutine.date).toLocaleDateString()
                      : "N/A"}{" "}
                    | Status: {dailyRoutine.routineStatus || "Unknown"}
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
                          Complete Routine
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
                      Steps
                    </h4>
                    {!dailyRoutine.steps || dailyRoutine.steps.length === 0 ? (
                      <p className="text-gray-600 italic">No steps defined.</p>
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
                                  Step {step.stepNumber || "N/A"}:
                                </span>{" "}
                                {step.action || "No action"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {step.description || "No description"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Time: {step.timeOfDay || "Not specified"} |
                                Status:{" "}
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
                                    "Chưa diễn ra"}
                                </span>
                              </p>
                              {step.product && (
                                <p className="text-gray-500 text-sm">
                                  Product: {step.product.name || "N/A"}
                                </p>
                              )}
                            </div>
                            {isToday(dailyRoutine.date) &&
                              (step.routineStatus || step.routineStatusEnum) !==
                                "DONE" && (
                                <button
                                  onClick={() =>
                                    markStepAsCompleted(
                                      step.id,
                                      dailyRoutine.id
                                    )
                                  }
                                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200 text-sm font-medium"
                                >
                                  + Check Out
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
