import { instance } from "../instance";

const getCart = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await instance.get("/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Cant get cart: ", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to get cart",
    };
  }
};

const addItemToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem("token");
    const res = await instance.post(
      `/carts?productId=${productId}&quantity=${quantity}`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Cant add item to cart: ", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add item to cart",
    };
  }
};

const updateCart = async ({ productId, quantity }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await instance.patch(
      `/carts/update-quantity?productId=${productId}&quantity=${quantity}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Cant update cart: ", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update cart",
    };
  }
};

const removeCart = async ({ productId }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await instance.delete(`/carts/remove?productIds=${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Cant remove cart: ", error);
    return {
      error: true,
      message: error.response?.message || "Failed to remove cart",
    };
  }
};

export { getCart, addItemToCart, updateCart, removeCart };
