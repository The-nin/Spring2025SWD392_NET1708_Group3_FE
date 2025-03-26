import { toast } from "react-toastify";
import { instance } from "../instance";

//Tạo đơn
export const createBooking = async (formData) => {
    const token = localStorage.getItem("token");

    const requestData = {...formData};

  try {
    const response = await instance.post("/booking-order", requestData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    });
  
    return response;
  } catch (error) {
      console.error("Error creating booking:", error);
      if (error && error.response && error.response.data) {
        const errorCode = error.response.data.code;

        // Sử dụng switch-case để xử lý các mã lỗi
        switch (errorCode) {
          case 1905:
              toast.error("Bạn chỉ có thể đặt tối đa 3 đơn/ngày");
              break;
          case 1906:
              toast.error("Hết hạn đặt lịch");
              break;
          case 1907:
              toast.error("Tư vấn viên này đã có lịch trong giờ này!!!");
              break;
          default:
              toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
              break;
        }
      }
  }
};

//Lấy tất cả experts
export const getAllExperts = async () => {

  const token = localStorage.getItem("token");

  try {
      const response = await instance.get("/booking-order/filter-expert",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

//Lấy các đơn dịch vụ bởi expert
export const getAllConsultantBookingByExpert = async () => {

  const token = localStorage.getItem("token");
  
  try {
    const response = await instance.get("/admin/booking-order/booking-order-expert",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return response.result
  } catch (error) {
    console.error("Get consultant booking error:", error);
  }
}

//Lấy các đơn dịch vụ bơi user
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

export const getAllBooking = async () => {

  const token = localStorage.getItem("token");

  try {
    const response = await instance.get("/admin/booking-order/all-booking-order",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.result;
  } catch (error) {
    console.error("Failed to get booking by user:", error);
  } 
}

//Hủy đơn dịch vụ
export const cancelBooking = async (bookingOrrderId, note) =>{

  const token = localStorage.getItem("token");

  try {
    const response = await instance.patch(`/booking-order/${bookingOrrderId}`, note,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return response
  } catch (error) {
    console.error("Failed to get booking by user:", error); 
  }
}

//Lấy đơn dịch vụ theo id
export const getBookingById = async (bookingId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.get(`/admin/booking-order/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response.result
  } catch (error) {
    console.error("Failed to get booking by user:", error);
  }
}

export const updateStatus = async (bookingId, value) => {
  const token = localStorage.getItem("token");
  try {
    const res = await instance.put(`/booking-order/${bookingId}`,
      {
        status: value.status,
        response: value.response || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    return res
  } catch (error) {
    console.error("Failed to get booking by user:", error);
  }
}

export const showStepsProgress = async (bookingId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.get(`/process-booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response.result.status
  } catch (error){
    console.error("Failed to get booking by user:", error);
  }
}