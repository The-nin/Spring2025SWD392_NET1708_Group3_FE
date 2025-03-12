import { instance } from "../instance";

//Tạo đơn
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

//Lấy tất cả experts
export const getAllExperts = async () => {

  const token = localStorage.getItem("token");

  try {
      const response = await instance.get("/booking-order/filter-expert",
        {
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.result
  } catch (error){
      console.error("Get experts error:", error);
  }
}

//Tạo thanh toán
export const createPayment = async (bookingOrderId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");
  try {
    const response = await instance.post(
      `/booking-order/payment?bookingOrderId=${bookingOrderId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );

    return response; 
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    throw error; 
  }
}

//Lấy các ssonw dịch vụ bởi expert
export const getAllConsultantBookingByExpert = async () => {

  const token = localStorage.getItem("token");
  
  try {
    const response = await instance.get("/admin/booking-order/booking-order-expert",
      {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return response.result
  } catch (error) {
    console.error("Get consultant booking error:", error);
  }
}

export const getAllBookingByUser = async () => {

  const token = localStorage.getItem("token");

  if(!token){
    throw new Error("Unauthorized: No token found");
  }

  try {
    const response = await instance.get("/booking-order/filter-user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.result;


  } catch (error) {
    console.error("Failed to get booking by user:", error);
  }
}