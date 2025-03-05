import { instance } from "../instance"

//Admin functions
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

const createNewService = async (values) =>{

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

//Customer functions
const getServices = async () => {
    try {

        const response = await instance.get("/skincare-service/alls")

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