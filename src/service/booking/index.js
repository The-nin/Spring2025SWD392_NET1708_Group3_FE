import { instance } from "../instance";

export const createBooking = async (formData) => {
    const token = localStorage.getItem("token");

  try {
    const response = await instance.post("/booking-order", formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};

export const getAllExperts = async () => {
  try {
      const response = await instance.get("/booking-order/filter-expert")
      return response.result
  } catch (error){
      console.error("Get experts error:", error);
  }
}