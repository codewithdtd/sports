import createApiClient from "./api.service";
// import { sendRequest } from "./api.service";
import { createAxiosInstance } from "./api.service";

class BaseService {
    // constructor(baseUrl) {
    //     this.api = createApiClient(baseUrl);
    // }
    constructor(baseUrl, user, dispatch, stateSuccess) {
        // Tạo Axios instance với interceptor
        this.api = createAxiosInstance(baseUrl, user, dispatch, stateSuccess);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        // return (await sendRequest(this.api.defaults.baseURL, data)).data;
        return (await this.api.post('/', data)).data;
    }
    // async deleteAll() {
    //     return (await this.api.delete("/")).data;
    // }
    async get( id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async getByType(data) {
        return (await this.api.post('/find', data)).data;
    }
    async update( id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete( id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default BaseService;