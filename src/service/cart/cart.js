import { instance } from "../instance";

const getCart = async () => {
    try{
        const token = localStorage.getItem("token");
        const res = await instance.get("/carts", {
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return res
    } catch (error) {
        console.error("Cant get cart: ",error);
        return{
            error: true,
            message: error.response?.data?.message || "Failed to get cart"
        }
    }
};

const addItemToCart = async (id) => {
    try{
        const token = localStorage.getItem("token");
        const res = await instance.post(`/carts/${id}`,
        {
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return res;
    } catch (error) {
        console.error("Cant add item to cart: ",error);
        return{
            error: true,
            message: error.response?.data?.message || "Failed to add item to cart"
        }
    }
};

const updateCart = async (param) => {
    param = {productID: param.productID, quantity: param.quantity};
    const token = localStorage.getItem("token");
    try{
        const res = await instance.put("/carts/update-quantity", param, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return res;
    } catch (error) {
        console.error("Cant update cart: ",error);
        return{
            error: true,    
            message: error.response?.data?.message || "Failed to update cart"
        }
    }
};

const removeCart = async (productID) => {
    try{
        const token = localStorage.getItem("token");
        const res = await instance.delete("/carts/remove", productID,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return res;
    } catch (error) {
        console.error("Cant remove cart: ",error);
        return{
            error: true,    
            message: error.response?.data?.message || "Failed to remove cart"
        }
    }
};

export {
    getCart,
    addItemToCart,
    updateCart,
    removeCart
}