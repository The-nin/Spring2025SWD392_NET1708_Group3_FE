import { instance } from "../instance";

export const getAddresses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Can't get addresses: ", error);
    return {
      error: true,
      message: error.response?.message || "Failed to get addresses",
    };
  }
};

export const addNewAddress = async (addressData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/addresses",
      {
        name: addressData.name,
        phone: addressData.phone,
        city: addressData.city,
        district: addressData.district,
        ward: addressData.ward,
        street: addressData.street,
        addressLine: `${addressData.street}, ${addressData.ward}, ${addressData.district}, ${addressData.city}`,
        isDefault: addressData.default,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Can't add new address: ", error);
    return {
      error: true,
      message: error.response?.message || "Failed to add new address",
    };
  }
};

export const updateAddress = async (id, addressData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Sending update request with data:", {
      id,
      addressData,
      token,
    });

    const response = await instance.put(
      `/addresses/${id}`,
      {
        name: addressData.name,
        phone: addressData.phone,
        city: addressData.city,
        district: addressData.district,
        ward: addressData.ward,
        street: addressData.street,
        addressLine: `${addressData.street}, ${addressData.ward}, ${addressData.district}, ${addressData.city}`,
        isDefault: Boolean(addressData.isDefault),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Update response:", response);

    if (response.status === 200) {
      return {
        code: 200,
        message: "Address updated successfully",
      };
    }

    return response;
  } catch (error) {
    console.error("Can't update address: ", error);
    console.error("Error details:", {
      response: error.response,
      message: error.message,
      stack: error.stack,
    });

    return {
      error: true,
      message: error.response?.data?.message || "Failed to update address",
    };
  }
};

export const setDefaultAddress = async (addressId) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Setting default address for ID:", addressId);

    const response = await instance.put(
      `/addresses/default/${addressId}`,
      {}, // empty body vì chỉ cần truyền addressId qua URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Set default response:", response);

    if (response.status === 200) {
      return {
        code: 200,
        message: "Default address set successfully",
      };
    }

    return response;
  } catch (error) {
    console.error("Can't set default address: ", error);
    console.error("Error details:", {
      response: error.response,
      message: error.message,
      stack: error.stack,
    });

    return {
      error: true,
      message: error.response?.data?.message || "Failed to set default address",
    };
  }
};
