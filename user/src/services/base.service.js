import createApiClient from "./api.service";
import { createAxiosInstance } from "./api.service";
class BaseService {
    // constructor(baseUrl) {
    //     this.api = createApiClient(baseUrl);
    // }
    constructor(baseUrl, user, dispatch, stateSuccess) {
        // Tạo Axios instance với interceptor
        this.api = createAxiosInstance(baseUrl, user, dispatch, stateSuccess);
    }

    async getAll(accessToken) {
        return (await this.api.get("/", {
            headers: { token: `Bearer ${accessToken}` }
        })).data;
    }
    async create(data, accessToken = '') {
        return (await this.api.post("/", data, {
            headers: { token: `Bearer ${accessToken}` }
        })).data;
    }
    // async deleteAll() {
    //     return (await this.api.delete("/")).data;
    // }
    async get( id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update( id, data, accessToken = '') {
        return (await this.api.put(`/${id}`, data, {
            headers: { token: `Bearer ${accessToken}` }
        })).data;
    }
    async delete( id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default BaseService;