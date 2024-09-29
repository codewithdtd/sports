import BaseService from "./base.service";

class Review extends BaseService {
    constructor() {
        super('/api/user/review'); 
    }
    async getOne(data) {
        return (await this.api.post(`/find`, data)).data;
    }
}

export default new Review();