import BaseService from "./base.service";

class Booking extends BaseService {
    constructor() {
        super('/api/user/booking'); 
    }
    async getAll(id ,accessToken) {
        return (await this.api.get("/", {params: id}, {
            headers: { token: `Bearer ${accessToken}` }
        })).data;
    }
}

export default new Booking();