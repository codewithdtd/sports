import BaseService from "./base.service";
import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";

class SportType extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/sportType', user, dispatch, loginSuccess); 
    }
    async create(data) {
       const result = (await this.api.post("/", data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
       })).data
       return result;
    }
    async update(id, data) {
       const result = (await this.api.put(`/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
       })).data
       return result;
    }
    async deleteImage(id, data) {
        const result = (await this.api.delete(`/image/${id}`, { params: data })).data;
        return result;
    }
    
}

export default SportType;