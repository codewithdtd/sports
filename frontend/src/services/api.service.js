import axios from "axios";
import { jwtDecode } from "jwt-decode";
// Hàm kiểm tra xem dữ liệu có chứa file không
// const getContentType = (data) => {
//     // Kiểm tra nếu data là đối tượng FormData và có file
//     if (data instanceof FormData) {
//         for (let value of data.values()) {
//             if (value instanceof File) {
//                 return "multipart/form-data";
//             }
//         }
//     }
//     // Nếu không phải FormData hoặc không chứa file
//     return "application/json";
// };

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

// Hàm refresh token khi accessToken hết hạn
const refreshToken = async () => {
    try {
        const res = await axios.post("/api/admin/staff/refresh", {
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
            if (accessToken) {
                let date = new Date();
                const decodedToken = jwtDecode(accessToken);

                // Kiểm tra token có hết hạn chưa
                if (decodedToken.exp < date.getTime() / 1000) {
                    console.log("Token expired, refreshing token...");
                    const data = await refreshToken();
                    const refreshedUser = {
                        ...user,
                        accessToken: data?.accessToken,
                    };
                    dispatch(stateSuccess(refreshedUser)); 
                    config.headers["token"] = "Bearer " + data?.accessToken;
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



export default (baseURL) => {
    return axios.create({
        baseURL,
        headers: {
            Accept: "application/json",
        },
    });
};

// Hàm để gửi yêu cầu với cấu hình headers động
// export const sendRequest = async (baseURL, data) => {
//     const contentType = getContentType(data);

//     try {
//         const response = await axios({
//             method: 'post',
//             url: `${baseURL}/upload`, // Đổi thành endpoint của bạn
//             data,
//             headers: {
//                 "Content-Type": contentType,
//                 Accept: "application/json",
//             },
//         });

//         return response;
//     } catch (error) {
//         console.error("Error sending request:", error);
//         throw error;
//     }
// };
