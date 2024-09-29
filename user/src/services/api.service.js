// import axios from "axios";

// const commonConfig = {
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// };
// export default (baseURL) => {
//     return axios.create({
//         baseURL,
//         ...commonConfig,
//     });
// };

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Cấu hình chung cho tất cả các request
const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

// Hàm refresh token khi accessToken hết hạn
const refreshToken = async () => {
    try {
        const res = await axios.post("/api/user/refresh", {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log("Error refreshing token:", error);
    }
};

// Hàm tạo instance của Axios với interceptor
export const createAxiosInstance = (baseUrl, user, dispatch, stateSuccess) => {
    const instance = axios.create({
        baseURL: baseUrl,
        ...commonConfig,  
    });
    
    instance.interceptors.request.use(
        async (config) => {
            // const accessToken = config.headers["token"] || ''; // Lấy token từ headers nếu có
            const accessToken = user?.accessToken || '';
            console.log(accessToken)
            if (accessToken) {
                let date = new Date();
                const decodedToken = jwtDecode(accessToken);

                // Kiểm tra token có hết hạn chưa
                if (decodedToken.exp < date.getTime() / 1000) {
                    console.log("Token expired, refreshing token...");
                    const data = await refreshToken();
                    const refreshedUser = {
                        ...user,
                        accessToken: data.accessToken,
                    };
                    dispatch(stateSuccess(refreshedUser)); 
                    config.headers["token"] = "Bearer " + data.accessToken;
                } else {
                    config.headers["token"] = "Bearer " + accessToken;
                }
            }
            
            return config; 
        },
        (error) => {
            console.log("Error in request interceptor:", error);
            return Promise.reject(error);
        }
    );
    
    return instance; 
};


// Hàm tạo Axios client không có interceptor (nếu cần)
export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,  // Kết hợp cấu hình chung
    });
};
