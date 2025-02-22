import { instance } from "../instance";

export const getAllProduct = async () => {
    try{
        const res = await instance.get("/products");
        return res;
    }
    catch(error) {
        console.error(error);
        return{
            error: true,
            message: error.response?.data?.message || "Cant get all product"
        }
    }
};