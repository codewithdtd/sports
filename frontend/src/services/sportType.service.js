import BaseService from "./base.service";

class SportType extends BaseService {
    constructor() {
        super('/api/admin/sportType'); 
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

export default new SportType();