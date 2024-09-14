import axios from "axios";

// Hàm kiểm tra xem dữ liệu có chứa file không
const getContentType = (data) => {
    // Kiểm tra nếu data là đối tượng FormData và có file
    if (data instanceof FormData) {
        for (let value of data.values()) {
            if (value instanceof File) {
                return "multipart/form-data";
            }
        }
    }
    // Nếu không phải FormData hoặc không chứa file
    return "application/json";
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
export const sendRequest = async (baseURL, data) => {
    const contentType = getContentType(data);

    try {
        const response = await axios({
            method: 'post',
            url: `${baseURL}/upload`, // Đổi thành endpoint của bạn
            data,
            headers: {
                "Content-Type": contentType,
                Accept: "application/json",
            },
        });

        return response;
    } catch (error) {
        console.error("Error sending request:", error);
        throw error;
    }
};
