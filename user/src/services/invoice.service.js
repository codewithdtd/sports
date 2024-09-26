import BaseService from "./base.service";

class Invoice extends BaseService {
    constructor() {
        super('/api/user/invoice'); 
    }
    async getAll(id ,accessToken) {
        return (await this.api.get("/"+id, {
            headers: { token: `Bearer ${accessToken}` }
        })).data;
    }
}

export default new Invoice();