import { instance } from "../instance"

//Lấy tất cả dành cho role admin (hệ thống)
const getAllService = async () => {
    const token = localStorage.getItem("token");
    try{
        const response = await instance.get("/skincare-service/system/all",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        
        if(!response.result){
            console.error(response.message)
        }

        return response.result
    } catch (error) {
        console.error("Get service error:", error);
    }
}

//Tạo mới services
const createNewService = async (values) => {

    const token = localStorage.getItem("token");

    try {
        const response = await instance.post("/skincare-service",
            values,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response
    } catch (error) {
        console.error("Create service error:", error);
    }
}

//Lấy tất cả service
const getServices = async () => {

    const token = localStorage.getItem("token");

    try {
        const response = await instance.get("/skincare-service/alls",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )

        if(!response.result){
            console.error(response.message)
        }

        return response.result
    } catch (error) {
        console.error("Get service error:", error);
    }
}


export {
    getAllService,
    createNewService,
    getServices
}